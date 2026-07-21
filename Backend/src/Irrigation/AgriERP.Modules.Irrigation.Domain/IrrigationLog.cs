using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Irrigation.Domain
{
    public class IrrigationLog : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid WaterSourceId { get; private set; }
        public Guid FieldId { get; private set; }
        public decimal GallonsPumped { get; private set; }
        public decimal FlowRateGpm { get; private set; }
        public DateTime IrrigationDate { get; private set; }
        public string Notes { get; private set; } = "";

        protected IrrigationLog()
        {
        }

        public IrrigationLog(
            Guid tenantId,
            Guid waterSourceId,
            Guid fieldId,
            decimal gallonsPumped,
            decimal flowRateGpm,
            DateTime irrigationDate,
            string notes)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            WaterSourceId = waterSourceId;
            FieldId = fieldId;
            GallonsPumped = gallonsPumped >= 0 ? gallonsPumped : throw new ArgumentException("Gallons pumped cannot be negative.");
            FlowRateGpm = flowRateGpm >= 0 ? flowRateGpm : throw new ArgumentException("Flow rate GPM cannot be negative.");
            IrrigationDate = irrigationDate;
            Notes = notes ?? "";
        }
    }
}
