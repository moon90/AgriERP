using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.HR.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AgriERP.Modules.HR.Application.TimeCards.Commands.ApproveTimeCards
{
    public record ApproveTimeCardsCommand(
        Guid EmployeeId,
        DateTime StartDate,
        DateTime EndDate
    ) : IRequest<bool>;

    public class ApproveTimeCardsCommandHandler : IRequestHandler<ApproveTimeCardsCommand, bool>
    {
        private readonly IHrDbContext _context;
        private readonly ICurrentUserProvider _currentUserProvider;

        public ApproveTimeCardsCommandHandler(IHrDbContext context, ICurrentUserProvider currentUserProvider)
        {
            _context = context;
            _currentUserProvider = currentUserProvider;
        }

        public async Task<bool> Handle(ApproveTimeCardsCommand request, CancellationToken cancellationToken)
        {
            var manager = _currentUserProvider.UserId ?? "System Manager";

            var timeCards = await _context.TimeCards
                .Where(tc => tc.EmployeeId == request.EmployeeId &&
                             tc.Date >= request.StartDate.Date &&
                             tc.Date <= request.EndDate.Date &&
                             !tc.IsApproved)
                .ToListAsync(cancellationToken);

            if (!timeCards.Any())
            {
                return false;
            }

            foreach (var card in timeCards)
            {
                card.Approve(manager);
            }

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
