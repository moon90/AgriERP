using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Logistics.Domain
{
    public class StorageCharge : Entity, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid WeighbridgeTicketId { get; private set; }
        public int DaysStored { get; private set; }
        public decimal TotalCharge { get; private set; }
        public DateTime ChargeDate { get; private set; }
        public bool IsBilled { get; private set; }

        protected StorageCharge()
        {
        }

        public StorageCharge(
            Guid tenantId,
            Guid weighbridgeTicketId,
            int daysStored,
            decimal rentalRatePerTonPerDay,
            decimal billableTons,
            DateTime chargeDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            WeighbridgeTicketId = weighbridgeTicketId;
            DaysStored = daysStored >= 0 ? daysStored : throw new ArgumentException("Days stored cannot be negative.");
            TotalCharge = billableTons * daysStored * rentalRatePerTonPerDay;
            ChargeDate = chargeDate;
            IsBilled = false;
        }

        public void MarkBilled()
        {
            IsBilled = true;
        }
    }
}
