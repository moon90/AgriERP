using AgriERP.Modules.Auth.Presentation.Authorization;
using AgriERP.Modules.Finance.Application.Common;
using AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetTrialBalance;
using AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetBalanceSheet;
using AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetIncomeStatement;
using AgriERP.Modules.Finance.Application.Budgets.Commands.SetBudget;
using AgriERP.Modules.Finance.Application.Budgets.Queries.GetBudgetStatus;
using AgriERP.Modules.Finance.Application.FiscalYears.Commands.CreateFiscalYear;
using AgriERP.Modules.Finance.Application.FiscalYears.Commands.CloseFiscalYear;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/finance/[controller]")]
    public class LedgerController : ControllerBase
    {
        private readonly IFinanceDbContext _context;
        private readonly ISender _sender;

        public LedgerController(IFinanceDbContext context, ISender sender)
        {
            _context = context;
            _sender = sender;
        }

        [HttpGet("accounts")]
        [RequirePermission("Ledger.View")]
        public async Task<IActionResult> GetAccounts(CancellationToken cancellationToken)
        {
            var accounts = await _context.GeneralLedgerAccounts
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return Ok(accounts);
        }

        [HttpGet("trial-balance")]
        [RequirePermission("Ledger.View")]
        public async Task<IActionResult> GetTrialBalance(CancellationToken cancellationToken)
        {
            var query = new GetTrialBalanceQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpGet("balance-sheet")]
        [RequirePermission("Ledger.View")]
        public async Task<IActionResult> GetBalanceSheet(CancellationToken cancellationToken)
        {
            var query = new GetBalanceSheetQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpGet("income-statement")]
        [RequirePermission("Ledger.View")]
        public async Task<IActionResult> GetIncomeStatement(CancellationToken cancellationToken)
        {
            var query = new GetIncomeStatementQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpPost("budgets")]
        [RequirePermission("Ledger.View")]
        public async Task<IActionResult> SetBudget([FromBody] SetBudgetCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, BudgetId = result });
        }

        [HttpGet("budgets/{year:int}")]
        [RequirePermission("Ledger.View")]
        public async Task<IActionResult> GetBudgets(int year, CancellationToken cancellationToken)
        {
            var query = new GetBudgetStatusQuery(year);
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpPost("fiscal-years")]
        [RequirePermission("Ledger.View")]
        public async Task<IActionResult> CreateFiscalYear([FromBody] CreateFiscalYearCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, PeriodId = result });
        }

        [HttpGet("fiscal-years")]
        [RequirePermission("Ledger.View")]
        public async Task<IActionResult> GetFiscalYears(CancellationToken cancellationToken)
        {
            var periods = await _context.FiscalYearPeriods
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(periods);
        }

        [HttpPost("fiscal-years/close")]
        [RequirePermission("Ledger.View")]
        public async Task<IActionResult> CloseFiscalYear([FromBody] CloseFiscalYearCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, PeriodId = result });
        }
    }
}
