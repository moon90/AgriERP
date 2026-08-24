using AgriERP.Modules.Auth.Application.Common.Interfaces;
using AgriERP.Modules.Auth.Application.Users.Commands.RegisterTenant;
using AgriERP.Modules.Auth.Application.Users.Commands.RegisterUser;
using AgriERP.Modules.Auth.Application.Users.Queries.GetMyPermissions;
using AgriERP.Modules.Auth.Application.Users.Queries.GetUsers;
using AgriERP.Modules.Auth.Application.Users.Queries.LoginUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AgriERP.Modules.Auth.Presentation.Controllers
{
    public record SwitchTenantRequest(Guid TenantId);

    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IAuthDbContext _context;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthController(ISender sender, IAuthDbContext context, IJwtTokenGenerator jwtTokenGenerator)
        {
            _sender = sender;
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserQuery query)
        {
            var response = await _sender.Send(query);

            // রেসপন্সে AccessToken এবং TenantId রিটার্ন হবে
            return Ok(response);
        }

        //[HttpPost("register")]
        //public async Task<IActionResult> Register([FromBody] RegisterUserCommand command, CancellationToken cancellationToken)
        //{
        //    // MediatR এর মাধ্যমে Command-টি Handler এর কাছে পাঠানো হচ্ছে
        //    var userId = await _sender.Send(command, cancellationToken);

        //    return Ok(new { Message = "User registered successfully", UserId = userId });
        //}

        [AllowAnonymous]
        [HttpPost("register-tenant")]
        public async Task<IActionResult> RegisterTenant([FromBody] RegisterTenantCommand command)
        {
            // MediatR-এর মাধ্যমে সরাসরি হ্যান্ডলারের কাছে কমান্ডটি পাঠানো হচ্ছে
            var tenantId = await _sender.Send(command);

            return Ok(new
            {
                Message = "New Company and Admin user registered successfully!",
                TenantId = tenantId
            });
        }

        [Authorize] // এই এপিআই কল করতে অবশ্যই টোকেন লাগবে
        [HttpGet("my-permissions")]
        public async Task<IActionResult> GetMyPermissions(CancellationToken cancellationToken)
        {
            // টোকেন থেকে ইউজারের আইডি নেওয়া
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            // Query কল করে পারমিশন লিস্ট আনা
            var query = new GetMyPermissionsQuery(userId);
            var permissions = await _sender.Send(query, cancellationToken);

            return Ok(new { Permissions = permissions });
        }

        [Authorize] // অ্যাডমিন ছাড়া কেউ এমপ্লয়ি অ্যাড করতে পারবে না
        [HttpPost("register-user")] // রাউটের নাম ফ্রন্টএন্ডের সাথে মেলানো হলো
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserCommand command, CancellationToken cancellationToken)
        {
            var userId = await _sender.Send(command, cancellationToken);
            return Ok(new { Message = "Employee registered successfully", UserId = userId });
        }

        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            // MediatR-এর মাধ্যমে GetUsersQuery কল করা হচ্ছে
            var users = await _sender.Send(new GetUsersQuery());
            return Ok(users);
        }

        [Authorize]
        [HttpGet("tenants")]
        public async Task<IActionResult> GetTenants(CancellationToken cancellationToken)
        {
            var tenants = await _context.Tenants
                .AsNoTracking()
                .Where(t => t.IsActive)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Subdomain,
                    t.IsActive
                })
                .ToListAsync(cancellationToken);

            return Ok(tenants);
        }

        [Authorize]
        [HttpPost("switch-tenant")]
        public async Task<IActionResult> SwitchTenant([FromBody] SwitchTenantRequest request, CancellationToken cancellationToken)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
                return Unauthorized();

            var tenant = await _context.Tenants.FirstOrDefaultAsync(t => t.Id == request.TenantId && t.IsActive, cancellationToken);
            if (tenant == null)
                return NotFound(new { Message = "Tenant organization not found or inactive." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
            if (user == null)
                return NotFound(new { Message = "User not found." });

            // Generate token with switched tenant
            var token = _jwtTokenGenerator.GenerateToken(user);

            var permissions = await _sender.Send(new GetMyPermissionsQuery(userId), cancellationToken);

            return Ok(new
            {
                AccessToken = token,
                TenantId = tenant.Id,
                TenantName = tenant.Name,
                Permissions = permissions
            });
        }
    }
}
