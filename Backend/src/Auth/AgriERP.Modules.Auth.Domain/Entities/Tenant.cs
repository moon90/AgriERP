using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Domain.Entities
{
    public class Tenant : IAuditable
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; } // খামার বা কোম্পানির নাম
        public string? Subdomain { get; private set; } // ভবিষ্যতের জন্য (যেমন: farm1.agrierp.com)
        public bool IsActive { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // EF Core এর জন্য ফাঁকা কন্সট্রাক্টর
        protected Tenant() 
        {
            Name = null!;
        }

        public Tenant(string name, string? subdomain = null)
        {
            Id = Guid.NewGuid();
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Subdomain = subdomain;
            CreatedAt = DateTime.UtcNow;
            IsActive = true;
        }

        public void Deactivate()
        {
            IsActive = false;
        }
    }
}
