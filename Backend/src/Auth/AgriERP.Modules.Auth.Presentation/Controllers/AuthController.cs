using AgriERP.Modules.Auth.Application.Users.Commands.RegisterTenant;
using AgriERP.Modules.Auth.Application.Users.Commands.RegisterUser;
using AgriERP.Modules.Auth.Application.Users.Queries.GetMyPermissions;
using AgriERP.Modules.Auth.Application.Users.Queries.GetUsers;
using AgriERP.Modules.Auth.Application.Users.Queries.LoginUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AgriERP.Modules.Auth.Presentation.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ISender _sender;

        public AuthController(ISender sender)
        {
            _sender = sender;
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
    }
}
