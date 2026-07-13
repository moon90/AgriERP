using AgriERP.Modules.Auth.Application.Common.Interfaces;
using AgriERP.Modules.Auth.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace AgriERP.Modules.Auth.Application.Users.Commands.RegisterTenant
{
    public class RegisterTenantCommandHandler : IRequestHandler<RegisterTenantCommand, Guid>
    {
        private readonly IAuthDbContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public RegisterTenantCommandHandler(IAuthDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<Guid> Handle(RegisterTenantCommand request, CancellationToken cancellationToken)
        {
            // ১. আপনার Tenant এন্টিটি তৈরি করা
            // (যদি আপনার Tenant কন্সট্রাক্টরে সাবডোমেইন প্যারামিটার লাগে, তবে কোম্পানির নামকে ছোট হাতের অক্ষরে রূপান্তর করে পাস করতে পারেন)
            var subdomain = request.CompanyName.ToLower().Replace(" ", "");
            var tenant = new Tenant(request.CompanyName, subdomain);
            await _context.Tenants.AddAsync(tenant, cancellationToken);

            // ২. পাসওয়ার্ড হ্যাশ করা
            var passwordHash = _passwordHasher.Hash(request.Password);

            // ৩. আপনার রেকর্ডের প্রোপার্টি (request.Email, request.FullName) অনুযায়ী User তৈরি করা
            var user = new User(
                tenant.Id,
                request.Email,
                passwordHash,
                request.FullName
            );
            await _context.Users.AddAsync(user, cancellationToken);

            // ৪. এই ট্যানেন্টের জন্য "Tenant Admin" রোল তৈরি করা
            var adminRole = new Role(
                tenant.Id,
                "Tenant Admin",
                "Full access administrator for the tenant"
            );
            await _context.Roles.AddAsync(adminRole, cancellationToken);

            // ৫. Seeder দিয়ে তৈরি করা সমস্ত পারমিশন ডাটাবেস থেকে তুলে আনা
            var allPermissions = await _context.Permissions.ToListAsync(cancellationToken);

            // ৬. Admin রোলের সাথে সবগুলো পারমিশন লিংক করা (RolePermission টেবিল)
            var rolePermissions = allPermissions.Select(p => new RolePermission(adminRole.Id,p.Code)).ToList();

            await _context.RolePermissions.AddRangeAsync(rolePermissions, cancellationToken);

            // ৭. ইউজারকে এই অ্যাডমিন রোলটি অ্যাসাইন করা (UserRole টেবিল)
            var userRole = new UserRole(user.Id,adminRole.Id);
            await _context.UserRoles.AddAsync(userRole, cancellationToken);

            // ৮. একটিমাত্র ট্রানজেকশনে সবকিছু ডাটাবেসে সেভ করা
            await _context.SaveChangesAsync(cancellationToken);

            return tenant.Id;
        }
    }
}
