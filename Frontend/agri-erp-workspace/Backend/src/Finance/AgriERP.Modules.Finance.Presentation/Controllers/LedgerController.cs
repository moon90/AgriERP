using AgriERP.Modules.Auth.Presentation.Authorization;
using AgriERP.Modules.Finance.Application.Common;
using AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetTrialBalance;
using AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetBalanceSheet;
using AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetIncomeStatement;
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
    }
}
