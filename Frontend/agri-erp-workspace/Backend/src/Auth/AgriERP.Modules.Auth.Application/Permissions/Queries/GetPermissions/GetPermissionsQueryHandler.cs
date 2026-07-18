using AgriERP.Modules.Auth.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Permissions.Queries.GetPermissions;

public class GetPermissionsQueryHandler : IRequestHandler<GetPermissionsQuery, List<PermissionDto>>
{
    private readonly IAuthDbContext _context;

    public GetPermissionsQueryHandler(IAuthDbContext context)
    {
        _context = context;
    }

    public async Task<List<PermissionDto>> Handle(GetPermissionsQuery request, CancellationToken cancellationToken)
    {
        // ডাটাবেস থেকে সব পারমিশন তুলে DTO তে ম্যাপ করে পাঠানো
        return await _context.Permissions
            .Select(p => new PermissionDto(p.Code, p.Name, p.Module))
            .ToListAsync(cancellationToken);
    }
}