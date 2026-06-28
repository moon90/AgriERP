using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Infrastructure
{
    public class LivestockDbContext : ApplicationDbContext, ILivestockDbContext
    {
        public DbSet<Animal> Animals { get; set; }

        public LivestockDbContext(DbContextOptions<LivestockDbContext> options, ITenantProvider tenantProvider) : base(options, tenantProvider)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // PostgreSQL Schema-per-Module Setup (Livestock module-er shob table 'livestock' schema te thakbe)
            modelBuilder.HasDefaultSchema("livestock");

            // Configuration of Animal Entity
            modelBuilder.Entity<Animal>(entity =>
            {
                entity.ToTable("Animals");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.TagNumber).IsUnique();

                // AUTOMATIC MULTI-TENANCY FILTER: DbContext query korar somoy auto current tenant id check korbe
                entity.HasQueryFilter(a => a.TenantId == CurrentTenantId);
            });
        }
    }
}
