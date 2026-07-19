using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Finance.Application.Common;
using AgriERP.Modules.Finance.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.Budgets.Commands.SetBudget
{
    public record SetBudgetCommand(string AccountCode, int FiscalYear, decimal AllocatedAmount) : IRequest<Guid>;

    public class SetBudgetCommandHandler : IRequestHandler<SetBudgetCommand, Guid>
    {
        private readonly IFinanceDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public SetBudgetCommandHandler(IFinanceDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(SetBudgetCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Verify general ledger account exists
            var accountExists = await _context.GeneralLedgerAccounts
                .AnyAsync(a => a.AccountCode == request.AccountCode, cancellationToken);
            if (!accountExists)
            {
                throw new InvalidOperationException($"General Ledger Account with code '{request.AccountCode}' does not exist.");
            }

            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.AccountCode == request.AccountCode && b.FiscalYear == request.FiscalYear, cancellationToken);

            if (budget == null)
            {
                budget = new Budget(tenantId, request.AccountCode, request.FiscalYear, request.AllocatedAmount);
                await _context.Budgets.AddAsync(budget, cancellationToken);
            }
            else
            {
                budget.UpdateBudget(request.AllocatedAmount);
            }

            await _context.SaveChangesAsync(cancellationToken);
            return budget.Id;
        }
    }
}
