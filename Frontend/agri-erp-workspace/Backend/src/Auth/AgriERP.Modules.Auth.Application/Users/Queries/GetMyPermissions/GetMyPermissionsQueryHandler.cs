using AgriERP.Modules.Auth.Application.Common.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace AgriERP.Modules.Auth.Application.Users.Queries.GetMyPermissions
{
    public class GetMyPermissionsQueryHandler : IRequestHandler<GetMyPermissionsQuery, List<string>>
    {
        private readonly IAuthDbContext _context;

        public GetMyPermissionsQueryHandler(IAuthDbContext context)
        {
            _context = context;
        }

        public async Task<List<string>> Handle(GetMyPermissionsQuery request, CancellationToken cancellationToken)
        {
            // ১. ইউজারের কী কী রোল আছে তা খুঁজে বের করা
            var userRoles = await _context.UserRoles
                .Where(ur => ur.UserId == request.UserId)
                .Select(ur => ur.RoleId)
                .ToListAsync(cancellationToken);

            if (!userRoles.Any())
            {
                return new List<string>(); // কোনো রোল না থাকলে ফাঁকা লিস্ট
            }

            // ২. সেই রোলগুলোর অধীনে কী কী পারমিশন আছে তা বের করা
            var permissions = await _context.RolePermissions
                .Where(rp => userRoles.Contains(rp.RoleId))
                .Select(rp => rp.PermissionCode)
                .Distinct() // একাধিক রোলে একই পারমিশন থাকলে ডুপ্লিকেট বাদ দেওয়া হবে
                .ToListAsync(cancellationToken);

            return permissions;
        }
    }
}
