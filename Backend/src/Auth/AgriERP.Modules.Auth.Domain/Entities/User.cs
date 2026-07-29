using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Domain.Entities
{
    public class User : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public string FullName { get; private set; }
        public bool IsActive { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // EF Core এর জন্য
        protected User() 
        {
            Email = null!;
            PasswordHash = null!;
            FullName = null!;
        }

        public User(Guid tenantId, string email, string passwordHash, string fullName)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            Email = email;
            PasswordHash = passwordHash;
            FullName = fullName;
            IsActive = true;
        }

        public void Deactivate()
        {
            IsActive = false;
        }

        public void UpdatePasswordHash(string newHash)
        {
            PasswordHash = newHash;
        }
    }
}
