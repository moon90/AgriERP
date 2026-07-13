using AgriERP.Modules.Auth.Application.Permissions.Queries.GetPermissions;
using AgriERP.Modules.Auth.Application.Roles.Commands.CreateRole;
using AgriERP.Modules.Auth.Application.Roles.Queries.GetRoles;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgriERP.Api.Controllers; // আপনার প্রজেক্টের আসল নেমস্পেস ব্যবহার করবেন

[Authorize] // এন্টারপ্রাইজ সিকিউরিটি: লগইন ছাড়া কেউ এই API কল করতে পারবে না
[ApiController]
[Route("api/v1/auth/[controller]")]
public class RolesController : ControllerBase
{
    private readonly ISender _sender;

    public RolesController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// UI-তে চেকবক্স বা ম্যাট্রিক্স দেখানোর জন্য সব পারমিশন নিয়ে আসবে
    /// GET: api/v1/auth/roles/permissions
    /// </summary>
    [HttpGet("permissions")]
    public async Task<IActionResult> GetPermissions(CancellationToken cancellationToken)
    {
        var permissions = await _sender.Send(new GetPermissionsQuery(), cancellationToken);
        return Ok(permissions);
    }

    /// <summary>
    /// নতুন রোল এবং তার পারমিশনগুলো ডাটাবেসে সেভ করবে
    /// POST: api/v1/auth/roles
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleCommand command, CancellationToken cancellationToken)
    {
        var roleId = await _sender.Send(command, cancellationToken);
        return Ok(new { Message = "Role and permissions created successfully!", RoleId = roleId });
    }

    /// <summary>
    /// Employee ফর্মে ড্রপডাউন দেখানোর জন্য
    /// GET: api/v1/auth/roles
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetRoles(CancellationToken cancellationToken)
    {
        var roles = await _sender.Send(new GetRolesQuery(), cancellationToken);
        return Ok(roles);
    }
}