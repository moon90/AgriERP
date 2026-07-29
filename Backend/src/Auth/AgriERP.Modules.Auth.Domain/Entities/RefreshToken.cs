using AgriERP.BuildingBlocks.Domain;
using System;
using System.Security.Cryptography;

namespace AgriERP.Modules.Auth.Domain.Entities
{
    public class RefreshToken : Entity
    {
        public Guid UserId { get; private set; }
        public string Token { get; private set; } = string.Empty;
        public DateTime ExpiresAt { get; private set; }
        public bool IsRevoked { get; private set; }
        public DateTime CreatedAt { get; private set; }

        private RefreshToken() { }

        public RefreshToken(Guid userId, int expiryDays = 7)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            Token = GenerateCryptographic64ByteToken();
            CreatedAt = DateTime.UtcNow;
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays);
            IsRevoked = false;
        }

        public bool IsActive => !IsRevoked && DateTime.UtcNow < ExpiresAt;

        public void Revoke()
        {
            IsRevoked = true;
        }

        private static string GenerateCryptographic64ByteToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
