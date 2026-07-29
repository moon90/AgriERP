using AgriERP.Modules.Auth.Application.Common.Interfaces;
using AgriERP.Modules.Auth.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AgriERP.Modules.Auth.Infrastructure.Persistence;

namespace AgriERP.Modules.Auth.Infrastructure.Seeding
{
    public class AuthDbSeeder : IAuthDbSeeder
    {
        private readonly AuthDbContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public AuthDbSeeder(AuthDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task SeedAsync()
        {
            // 1. Core System Permissions
            var systemPermissions = new List<Permission>
            {
                new Permission("Users.View", "View Users", "Identity"),
                new Permission("Users.Create", "Create Users", "Identity"),
                new Permission("Roles.Manage", "Manage Roles", "Identity"),
                new Permission("Livestock.View", "View Livestock Data", "Livestock"),
                new Permission("Livestock.Create", "Add New Livestock", "Livestock"),
                new Permission("Livestock.Update", "Update Livestock Info", "Livestock"),
                new Permission("Inventory.View", "View Inventory", "Inventory"),
                new Permission("Inventory.Manage", "Manage Inventory", "Inventory"),
                new Permission("Crops.View", "View Crops Data", "Crops"),
                new Permission("Crops.Manage", "Manage Crops Data", "Crops"),
                new Permission("Ledger.View", "View Financial Ledger", "Finance"),
                new Permission("Ledger.Manage", "Manage Financial Ledger", "Finance"),
                new Permission("HR.View", "View HR & Payroll", "HR"),
                new Permission("HR.Manage", "Manage HR & Payroll", "HR")
            };

            foreach (var permission in systemPermissions)
            {
                if (!await _context.Permissions.AnyAsync(p => p.Code == permission.Code))
                {
                    await _context.Permissions.AddAsync(permission);
                }
            }
            await _context.SaveChangesAsync();

            // 2. Ensure Default Tenant Exists
            var defaultTenant = await _context.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync();
            if (defaultTenant == null)
            {
                defaultTenant = new Tenant("AgriERP Enterprise", "agrierp");
                await _context.Tenants.AddAsync(defaultTenant);
                await _context.SaveChangesAsync();
            }

            // 3. Ensure Default Admin User Exists & Password Hash Updated
            var adminUser = await _context.Users.IgnoreQueryFilters().FirstOrDefaultAsync(u => u.Email == "admin@email.com");
            if (adminUser == null)
            {
                var pwdHash = _passwordHasher.Hash("admin123");
                adminUser = new User(defaultTenant.Id, "admin@email.com", pwdHash, "System Administrator");
                await _context.Users.AddAsync(adminUser);
            }
            else
            {
                adminUser.UpdatePasswordHash(_passwordHasher.Hash("admin123"));
                _context.Users.Update(adminUser);
            }
            await _context.SaveChangesAsync();

            // 4. Ensure Admin Role Exists
            var adminRole = await _context.Roles.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Name == "Admin" && r.TenantId == adminUser.TenantId);
            if (adminRole == null)
            {
                adminRole = new Role(adminUser.TenantId, "Admin", "System Administrator");
                await _context.Roles.AddAsync(adminRole);
                await _context.SaveChangesAsync();
            }

            // 5. Assign Permissions to Admin Role
            foreach (var permission in systemPermissions)
            {
                if (!await _context.RolePermissions.AnyAsync(rp => rp.RoleId == adminRole.Id && rp.PermissionCode == permission.Code))
                {
                    await _context.RolePermissions.AddAsync(new RolePermission(adminRole.Id, permission.Code));
                }
            }

            // 6. Assign Admin Role to adminUser
            if (!await _context.UserRoles.AnyAsync(ur => ur.UserId == adminUser.Id && ur.RoleId == adminRole.Id))
            {
                await _context.UserRoles.AddAsync(new UserRole(adminUser.Id, adminRole.Id));
            }

            await _context.SaveChangesAsync();
        }
    }
}
