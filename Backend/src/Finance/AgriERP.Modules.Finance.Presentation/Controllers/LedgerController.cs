using AgriERP.Modules.Auth.Presentation.Authorization;
using AgriERP.Modules.Finance.Application.Common;
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

        public LedgerController(IFinanceDbContext context)
        {
            _context = context;
        }

        [HttpGet("accounts")]
        [RequirePermission("Ledger.View")] // Audited Permission check!
        public async Task<IActionResult> GetAccounts(CancellationToken cancellationToken)
        {
            var accounts = await _context.GeneralLedgerAccounts
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return Ok(accounts);
        }
    }
}
