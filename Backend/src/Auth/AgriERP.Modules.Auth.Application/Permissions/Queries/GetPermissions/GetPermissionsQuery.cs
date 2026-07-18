using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Permissions.Queries.GetPermissions
{
    // ফ্রন্টএন্ডে পাঠানোর জন্য DTO
    public record PermissionDto(string Code, string Name, string Module);

    // Query Record
    public record GetPermissionsQuery() : IRequest<List<PermissionDto>>;
}
