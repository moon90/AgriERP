using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Auth.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Users.Queries.GetUsers
{
    public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, List<UserDto>>
    {
        private readonly IAuthDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetUsersQueryHandler(IAuthDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            // ১. বর্তমান ইউজারের ট্যানেন্ট আইডি নেওয়া
            var currentTenantId = _tenantProvider.TenantId;

            // ২. ডাটাবেস থেকে শুধু ওই ট্যানেন্টের ইউজারদের লিস্ট আনা
            var users = await _context.Users
                .Where(u => u.TenantId == currentTenantId) // ট্যানেন্ট আইসোলেশন
                .Select(u => new UserDto(
                    u.Id,
                    u.Email,
                    u.FullName,
                    u.IsActive))
                .ToListAsync(cancellationToken);

            return users;
        }
    }
}
