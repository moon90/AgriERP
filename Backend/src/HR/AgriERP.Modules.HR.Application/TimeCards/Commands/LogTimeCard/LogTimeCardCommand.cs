using System;
using System.Threading;
using System.Threading.Tasks;
using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.HR.Application.Common;
using AgriERP.Modules.HR.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AgriERP.Modules.HR.Application.TimeCards.Commands.LogTimeCard
{
    public record LogTimeCardCommand(
        Guid EmployeeId,
        DateTime Date,
        TimeSpan ClockIn,
        TimeSpan ClockOut
    ) : IRequest<Guid>;

    public class LogTimeCardCommandHandler : IRequestHandler<LogTimeCardCommand, Guid>
    {
        private readonly IHrDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public LogTimeCardCommandHandler(IHrDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(LogTimeCardCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var employee = await _context.Employees.FirstOrDefaultAsync(
                e => e.Id == request.EmployeeId, 
                cancellationToken
            );

            if (employee == null)
            {
                throw new Exception("Employee not found.");
            }

            if (!employee.IsHourly)
            {
                throw new Exception("Cannot log time cards for salaried employees.");
            }

            var timeCard = new TimeCard(
                tenantId,
                request.EmployeeId,
                request.Date,
                request.ClockIn,
                request.ClockOut
            );

            _context.TimeCards.Add(timeCard);
            await _context.SaveChangesAsync(cancellationToken);

            return timeCard.Id;
        }
    }
}
