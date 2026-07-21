using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Logistics.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Logistics.Application.Logistics.Queries.GetStorageAnalytics
{
    public record ElevatorOccupancyDto(
        System.Guid Id,
        string Name,
        decimal CapacityTons,
        decimal CurrentStoredTons,
        decimal UtilizationPercentage,
        decimal RentalRatePerTonPerDay
    );

    public record StorageAnalyticsDto(
        List<ElevatorOccupancyDto> Elevators,
        decimal TotalBilledRevenue,
        int PendingBillingTicketsCount
    );

    public record GetStorageAnalyticsQuery : IRequest<StorageAnalyticsDto>;

    public class GetStorageAnalyticsQueryHandler : IRequestHandler<GetStorageAnalyticsQuery, StorageAnalyticsDto>
    {
        private readonly ILogisticsDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetStorageAnalyticsQueryHandler(ILogisticsDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<StorageAnalyticsDto> Handle(GetStorageAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Load elevators
            var elevators = await _context.Elevators
                .AsNoTracking()
                .Where(e => e.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var elevatorDtos = elevators.Select(e => new ElevatorOccupancyDto(
                e.Id,
                e.Name,
                e.CapacityTons,
                e.CurrentStoredTons,
                e.CapacityTons > 0 ? (e.CurrentStoredTons / e.CapacityTons) * 100 : 0,
                e.RentalRatePerTonPerDay
            )).ToList();

            // Load revenue billed
            decimal totalRevenue = await _context.StorageCharges
                .AsNoTracking()
                .Where(c => c.TenantId == tenantId && c.IsBilled)
                .SumAsync(c => c.TotalCharge, cancellationToken);

            // Fetch pending billing tickets count (tickets in Approved status)
            int pendingBillingCount = await _context.WeighbridgeTickets
                .AsNoTracking()
                .Where(t => t.TenantId == tenantId && t.Status == "Approved")
                .CountAsync(cancellationToken);

            return new StorageAnalyticsDto(
                elevatorDtos,
                totalRevenue,
                pendingBillingCount
            );
        }
    }
}
