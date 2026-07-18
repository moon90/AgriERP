using AgriERP.Modules.Auth.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Infrastructure.Authentication
{
    public class BCryptPasswordHasher : IPasswordHasher
    {
        public string Hash(string password)
        {
            // BCrypt ব্যবহার করে পাসওয়ার্ড হ্যাশ করা
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool Verify(string password, string passwordHash)
        {
            // পাসওয়ার্ড ভেরিফাই করা
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
    }
}
