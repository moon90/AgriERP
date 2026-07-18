using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Common.Interfaces
{
    public interface IPasswordHasher
    {
        // পাসওয়ার্ড হ্যাশ করার জন্য
        string Hash(string password);

        // লগইনের সময় পাসওয়ার্ড ম্যাচ করার জন্য (পরবর্তীতে লাগবে)
        bool Verify(string password, string passwordHash);
    }
}
