using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Land.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Land.Application.Land.Queries.GetLeasePortfolio
{
    public record LandLeaseDto(
        Guid Id,
        string LeaseNumber,
        string LandlordName,
        Guid FieldId,
        string LeaseType,
        decimal CashRentPerAcre,
        decimal AreaAcres,
        decimal LandlordSharePercentage,
        DateTime ContractStartDate,
        DateTime ContractEndDate,
        string Status
    );

    public record LeasePaymentDto(
        Guid Id,
        Guid LandLeaseId,
        string LeaseNumber,
        string LandlordName,
        string PaymentType,
        decimal Amount,
        string CalculationDetails,
        DateTime PaymentDate,
        bool IsPaid
    );

    public record LandPortfolioDto(
        List<LandLeaseDto> Leases,
        List<LeasePaymentDto> Payments,
        decimal TotalRentExpenses,
        decimal TotalSharecropExpenses
    );

    public record GetLeasePortfolioQuery : IRequest<LandPortfolioDto>;

    public class GetLeasePortfolioQueryHandler : IRequestHandler<GetLeasePortfolioQuery, LandPortfolioDto>
    {
        private readonly ILandDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetLeasePortfolioQueryHandler(ILandDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<LandPortfolioDto> Handle(GetLeasePortfolioQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Load leases
            var leases = await _context.LandLeases
                .AsNoTracking()
                .Where(l => l.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var leaseDtos = leases.Select(l => new LandLeaseDto(
                l.Id,
                l.LeaseNumber,
                l.LandlordName,
                l.FieldId,
                l.LeaseType,
                l.CashRentPerAcre,
                l.AreaAcres,
                l.LandlordSharePercentage,
                l.ContractStartDate,
                l.ContractEndDate,
                l.Status
            )).ToList();

            // Load payments
            var payments = await _context.LeasePayments
                .AsNoTracking()
                .Where(p => p.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var paymentDtos = payments.Select(p => {
                var associatedLease = leases.FirstOrDefault(l => l.Id == p.LandLeaseId);
                return new LeasePaymentDto(
                    p.Id,
                    p.LandLeaseId,
                    associatedLease?.LeaseNumber ?? "Unknown",
                    associatedLease?.LandlordName ?? "Unknown",
                    p.PaymentType,
                    p.Amount,
                    p.CalculationDetails,
                    p.PaymentDate,
                    p.IsPaid
                );
            }).ToList();

            decimal totalRent = paymentDtos.Where(p => p.PaymentType == "Rent").Sum(p => p.Amount);
            decimal totalSharecrop = paymentDtos.Where(p => p.PaymentType == "SharecropYieldValue").Sum(p => p.Amount);

            return new LandPortfolioDto(
                leaseDtos,
                paymentDtos,
                totalRent,
                totalSharecrop
            );
        }
    }
}
