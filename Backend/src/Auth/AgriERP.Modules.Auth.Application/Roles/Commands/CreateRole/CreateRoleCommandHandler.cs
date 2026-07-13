using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Auth.Application.Common.Interfaces;
using AgriERP.Modules.Auth.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AgriERP.Modules.Auth.Application.Roles.Commands.CreateRole;

public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, Guid>
{
    private readonly IAuthDbContext _context;
    private readonly ITenantProvider _tenantProvider;

    public CreateRoleCommandHandler(IAuthDbContext context, ITenantProvider tenantProvider)
    {
        _context = context;
        _tenantProvider = tenantProvider;
    }

    public async Task<Guid> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        // ITenantProvider থেকে বর্তমান লগইন করা ইউজারের খামারের আইডি নেওয়া
        var tenantId = _tenantProvider.TenantId;

        // ১. নতুন Role অবজেক্ট তৈরি করা
        var role = new Role(tenantId, request.Name, request.Description);
        await _context.Roles.AddAsync(role, cancellationToken);

        // ২. Role-এর সাথে ফ্রন্টএন্ড থেকে আসা Permission গুলো লিংক করা
        if (request.PermissionCodes != null && request.PermissionCodes.Any())
        {
            var rolePermissions = request.PermissionCodes.Select(code =>
                new RolePermission(role.Id, code)).ToList();

            await _context.RolePermissions.AddRangeAsync(rolePermissions, cancellationToken);
        }

        // ৩. ডাটাবেসে সেভ করা
        await _context.SaveChangesAsync(cancellationToken);

        return role.Id;
    }
}