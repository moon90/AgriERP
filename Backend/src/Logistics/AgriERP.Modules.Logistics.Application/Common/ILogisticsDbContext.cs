using AgriERP.Modules.Logistics.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Logistics.Application.Common
{
    public interface ILogisticsDbContext
    {
        DbSet<Elevator> Elevators { get; }
        DbSet<WeighbridgeTicket> WeighbridgeTickets { get; }
        DbSet<StorageCharge> StorageCharges { get; }
        DbSet<Silo> Silos { get; }
        DbSet<ScaleTransfer> ScaleTransfers { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
