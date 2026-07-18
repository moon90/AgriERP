using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Common.Interfaces
{
    public interface IAuthDbSeeder
    {
        Task SeedAsync();
    }
}
