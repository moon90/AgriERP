using AgriERP.Modules.Auth.Application.Common.Interfaces;
using AgriERP.Modules.Auth.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using AgriERP.Modules.Auth.Infrastructure.Persistence;

namespace AgriERP.Modules.Auth.Infrastructure.Seeding
{
    public class AuthDbSeeder : IAuthDbSeeder
    {
        private readonly AuthDbContext _context;

        public AuthDbSeeder(AuthDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // ১. সিস্টেমের কোর পারমিশনগুলো ডিফাইন করা
            var systemPermissions = new List<Permission>
            {
                // Identity & Security Module
                new Permission("Users.View", "View Users", "Identity"),
                new Permission("Users.Create", "Create Users", "Identity"),
                new Permission("Roles.Manage", "Manage Roles", "Identity"),
                
                // Livestock Module
                new Permission("Livestock.View", "View Livestock Data", "Livestock"),
                new Permission("Livestock.Create", "Add New Livestock", "Livestock"),
                new Permission("Livestock.Update", "Update Livestock Info", "Livestock"),
                
                // Inventory Module
                new Permission("Inventory.View", "View Inventory", "Inventory"),
                new Permission("Inventory.Manage", "Manage Inventory", "Inventory")
            };

            // ডাটাবেসে পারমিশনগুলো না থাকলে ইনসার্ট করা
            foreach (var permission in systemPermissions)
            {
                if (!await _context.Permissions.AnyAsync(p => p.Code == permission.Code))
                {
                    await _context.Permissions.AddAsync(permission);
                }
            }
            await _context.SaveChangesAsync();

            // ২. আপনার তৈরি করা Admin ইউজারের তথ্য খুঁজে বের করা (যাতে আমরা তাকে রোল দিতে পারি)
            var adminUser = await _context.Users.IgnoreQueryFilters().FirstOrDefaultAsync(u => u.Email == "admin@email.com");

            if (adminUser != null)
            {
                // ৩. Admin রোল তৈরি করা (যদি না থাকে)
                var adminRole = await _context.Roles.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Name == "Admin" && r.TenantId == adminUser.TenantId);
                if (adminRole == null)
                {
                    adminRole = new Role(adminUser.TenantId, "Admin", "System Administrator");
                    await _context.Roles.AddAsync(adminRole);
                    await _context.SaveChangesAsync();
                }

                // ৪. Admin রোলকে সমস্ত পারমিশন দিয়ে দেওয়া
                foreach (var permission in systemPermissions)
                {
                    if (!await _context.RolePermissions.AnyAsync(rp => rp.RoleId == adminRole.Id && rp.PermissionCode == permission.Code))
                    {
                        await _context.RolePermissions.AddAsync(new RolePermission(adminRole.Id, permission.Code));
                    }
                }

                // ৫. আপনার admin@email.com ইউজারকে Admin রোলটি অ্যাসাইন করা
                if (!await _context.UserRoles.AnyAsync(ur => ur.UserId == adminUser.Id && ur.RoleId == adminRole.Id))
                {
                    await _context.UserRoles.AddAsync(new UserRole(adminUser.Id, adminRole.Id));
                }

                await _context.SaveChangesAsync();
            }
        }
    }
}
