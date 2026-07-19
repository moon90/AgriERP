using AgriERP.Modules.Assets.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Assets.Application.Assets.Queries.GetDepreciationSchedule
{
    public record DepreciationScheduleLineDto(
        int MonthIndex,
        DateTime Date,
        decimal MonthlyDepreciation,
        decimal AccumulatedDepreciation,
        decimal RemainingBookValue
    );

    public record GetDepreciationScheduleQuery(Guid AssetId) : IRequest<List<DepreciationScheduleLineDto>>;

    public class GetDepreciationScheduleQueryHandler : IRequestHandler<GetDepreciationScheduleQuery, List<DepreciationScheduleLineDto>>
    {
        private readonly IAssetsDbContext _context;

        public GetDepreciationScheduleQueryHandler(IAssetsDbContext context)
        {
            _context = context;
        }

        public async Task<List<DepreciationScheduleLineDto>> Handle(GetDepreciationScheduleQuery request, CancellationToken cancellationToken)
        {
            var asset = await _context.Assets
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == request.AssetId, cancellationToken);

            if (asset == null)
            {
                throw new InvalidOperationException($"Asset with ID '{request.AssetId}' does not exist.");
            }

            var schedule = new List<DepreciationScheduleLineDto>();
            decimal monthlyDep = asset.PurchasePrice / asset.UsefulLifeMonths;
            decimal accDep = 0;
            decimal bookValue = asset.PurchasePrice;

            var baseDate = asset.PurchaseDate;

            for (int i = 1; i <= asset.UsefulLifeMonths; i++)
            {
                var lineDate = baseDate.AddMonths(i);
                
                if (bookValue - monthlyDep < 0)
                {
                    monthlyDep = bookValue;
                }

                accDep += monthlyDep;
                bookValue -= monthlyDep;

                schedule.Add(new DepreciationScheduleLineDto(
                    i,
                    lineDate,
                    monthlyDep,
                    accDep,
                    bookValue
                ));

                if (bookValue <= 0)
                {
                    break;
                }
            }

            return schedule;
        }
    }
}
