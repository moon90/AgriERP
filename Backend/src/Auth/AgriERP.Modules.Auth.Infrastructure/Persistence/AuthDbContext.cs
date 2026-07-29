using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Auth.Application.Common.Interfaces;
using AgriERP.Modules.Auth.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Reflection.Emit;
using System.Text;

namespace AgriERP.Modules.Auth.Infrastructure.Persistence
{
    public class AuthDbContext : ApplicationDbContext, IAuthDbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<OutboxMessage> OutboxMessages { get; set; }

        public AuthDbContext(DbContextOptions<AuthDbContext> options, ITenantProvider tenantProvider, IPublisher publisher, ICurrentUserProvider currentUserProvider) : base(options, tenantProvider, publisher, currentUserProvider)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Auth মডিউলের জন্য আলাদা স্কিমা
            modelBuilder.HasDefaultSchema("auth");

            modelBuilder.Entity<Tenant>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Subdomain).HasMaxLength(100);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);

                // একই ইমেইল দিয়ে যেন দুইবার অ্যাকাউন্ট না খোলা যায়
                entity.HasIndex(e => e.Email).IsUnique();

                // Multi-tenant ফিল্টার
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Roles");
                entity.HasKey(e => e.Id);

                // Multi-tenant ফিল্টার
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.ToTable("UserRoles");
                // Composite Primary Key (UserId এবং RoleId মিলিয়ে)
                entity.HasKey(e => new { e.UserId, e.RoleId });
            });

            modelBuilder.Entity<Permission>(entity =>
            {
                entity.ToTable("Permissions");
                entity.HasKey(e => e.Code); // Code কলামটিই প্রাইমারি কি
            });

            modelBuilder.Entity<RolePermission>(entity =>
            {
                entity.ToTable("RolePermissions");
                entity.HasKey(e => new { e.RoleId, e.PermissionCode });
            });

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.ToTable("RefreshTokens");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Token).IsUnique();
                entity.HasIndex(e => e.UserId);
            });

            modelBuilder.Entity<OutboxMessage>(entity =>
            {
                entity.ToTable("OutboxMessages");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.ProcessedOn);
            });
        }
    }
}
