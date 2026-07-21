using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Logistics.Domain
{
    public class WeighbridgeTicket : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string TicketNumber { get; private set; } = null!;
        public Guid ElevatorId { get; private set; }
        public string VehicleNumber { get; private set; } = null!;
        public decimal GrossWeightTons { get; private set; }
        public decimal TareWeightTons { get; private set; }
        public decimal NetWeightTons { get; private set; }
        public decimal MoisturePercentage { get; private set; }
        public decimal ImpurityPercentage { get; private set; }
        public decimal FinalBillableWeightTons { get; private set; }
        public string? ContractClientId { get; private set; } // Client renting storage (if applicable)
        public DateTime TicketDate { get; private set; }
        public string Status { get; private set; } = "Draft"; // Draft, Approved, Billed

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected WeighbridgeTicket()
        {
        }

        public WeighbridgeTicket(
            Guid tenantId,
            string ticketNumber,
            Guid elevatorId,
            string vehicleNumber,
            decimal grossWeightTons,
            decimal tareWeightTons,
            decimal moisturePercentage,
            decimal impurityPercentage,
            string? contractClientId,
            DateTime ticketDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            TicketNumber = ticketNumber ?? throw new ArgumentNullException(nameof(ticketNumber));
            ElevatorId = elevatorId;
            VehicleNumber = vehicleNumber ?? throw new ArgumentNullException(nameof(vehicleNumber));
            
            if (grossWeightTons <= tareWeightTons)
                throw new ArgumentException("Gross weight must be greater than tare weight.");

            GrossWeightTons = grossWeightTons;
            TareWeightTons = tareWeightTons;
            NetWeightTons = grossWeightTons - tareWeightTons;
            MoisturePercentage = moisturePercentage;
            ImpurityPercentage = impurityPercentage;
            ContractClientId = contractClientId;
            TicketDate = ticketDate;
            Status = "Draft";

            CalculateQualityDeductions();
        }

        private void CalculateQualityDeductions()
        {
            decimal moistureExcess = MoisturePercentage > 14.0m ? MoisturePercentage - 14.0m : 0.0m;
            decimal moistureDeduction = moistureExcess * 0.012m * NetWeightTons; // 1.2% deduction per 1% moisture excess
            decimal impurityDeduction = ImpurityPercentage * 0.01m * NetWeightTons; // 1% deduction per 1% impurity

            FinalBillableWeightTons = NetWeightTons - moistureDeduction - impurityDeduction;

            if (FinalBillableWeightTons < 0)
            {
                FinalBillableWeightTons = 0;
            }
        }

        public void Approve()
        {
            if (Status != "Draft")
                throw new InvalidOperationException("Only draft tickets can be approved.");
            Status = "Approved";
        }

        public void MarkBilled()
        {
            if (Status != "Approved")
                throw new InvalidOperationException("Ticket must be Approved before billing.");
            Status = "Billed";
        }
    }
}
