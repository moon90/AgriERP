using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Agronomy.Domain
{
    public class AgronomyRecommendation : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid SoilSampleId { get; private set; }
        public string RecommendedFertilizerType { get; private set; } = null!;
        public decimal TargetApplicationRate { get; private set; } // e.g. lbs/acre or kg/acre
        public DateTime RecommendationDate { get; private set; }
        public string AgronomistName { get; private set; } = null!;
        public string Notes { get; private set; } = "";

        protected AgronomyRecommendation()
        {
        }

        public AgronomyRecommendation(
            Guid tenantId,
            Guid soilSampleId,
            string recommendedFertilizerType,
            decimal targetApplicationRate,
            DateTime recommendationDate,
            string agronomistName,
            string notes)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            SoilSampleId = soilSampleId;
            RecommendedFertilizerType = recommendedFertilizerType ?? throw new ArgumentNullException(nameof(recommendedFertilizerType));
            TargetApplicationRate = targetApplicationRate >= 0 ? targetApplicationRate : throw new ArgumentException("Target application rate cannot be negative.");
            RecommendationDate = recommendationDate;
            AgronomistName = agronomistName ?? throw new ArgumentNullException(nameof(agronomistName));
            Notes = notes ?? "";
        }
    }
}
