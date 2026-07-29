using System;
using System.Collections.Generic;
using System.Reflection;

namespace AgriERP.Api.Infrastructure
{
    public static class PiiMaskingPolicy
    {
        private static readonly HashSet<string> SensitiveKeys = new(StringComparer.OrdinalIgnoreCase)
        {
            "Password", "PasswordHash", "SecretKey", "CreditCard", "Ssn", "AccessToken", "RefreshToken"
        };

        public static string RedactIfSensitive(string propertyName, string value)
        {
            if (SensitiveKeys.Contains(propertyName))
            {
                return "*** REDACTED ***";
            }
            return value;
        }
    }
}
