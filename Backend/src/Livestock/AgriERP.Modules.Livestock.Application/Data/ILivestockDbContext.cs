using AgriERP.Modules.Livestock.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Data
{
    public interface ILivestockDbContext
    {
        DbSet<Animal> Animals { get; }

        // ডেটাবেসে ট্রানজেকশন সেভ করার জন্য
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
