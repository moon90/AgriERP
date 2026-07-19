using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Finance.Application.Common;
using AgriERP.Modules.Finance.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.FiscalYears.Commands.CreateFiscalYear
{
    public record CreateFiscalYearCommand(int Year, DateTime StartDate, DateTime EndDate) : IRequest<Guid>;

    public class CreateFiscalYearCommandHandler : IRequestHandler<CreateFiscalYearCommand, Guid>
    {
        private readonly IFinanceDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateFiscalYearCommandHandler(IFinanceDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateFiscalYearCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Check if year already exists for this tenant
            var exists = await _context.FiscalYearPeriods
                .AnyAsync(p => p.Year == request.Year, cancellationToken);
            if (exists)
            {
                throw new InvalidOperationException($"Fiscal year period for {request.Year} already exists.");
            }

            var period = new FiscalYearPeriod(tenantId, request.Year, request.StartDate, request.EndDate);
            await _context.FiscalYearPeriods.AddAsync(period, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
            return period.Id;
        }
    }
}
