using AgriERP.BuildingBlocks.Domain;
using AgriERP.Modules.Livestock.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Domain
{
    public class Animal : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; } // IMultiTenant interface implementation
        public string TagNumber { get; private set; } // RFID ba Asset Tag
        public string Species { get; private set; } // Goru, Chagol, Murgi, etc.
        public AnimalPurpose Purpose { get; private set; }
        public AnimalStatus Status { get; private set; }
        public DateTime DateOfBirth { get; private set; }
        public decimal CurrentWeight { get; private set; }

        // EF Core-er jonno empty constructor
        private Animal() { }

        // Factory Method: Notun animal register korar jonno
        public static Animal Register(Guid tenantId, string tagNumber, string species, AnimalPurpose purpose, DateTime dob, decimal initialWeight)
        {
            if (string.IsNullOrWhiteSpace(tagNumber))
                throw new ArgumentException("Tag number cannot be empty.");

            var animal = new Animal
            {
                Id = Guid.NewGuid(), // .NET 10 Sequential or Standard Guid
                TenantId = tenantId,
                TagNumber = tagNumber,
                Species = species,
                Purpose = purpose,
                Status = AnimalStatus.Active,
                DateOfBirth = dob,
                CurrentWeight = initialWeight
            };

            // Ekhane amra chaile 'AnimalRegisteredEvent' fire korte pari
            return animal;
        }

        // Business Logic: Ojonbriddhi track kora (Motatagakoron / Fattening proproject-er jonno)
        public void UpdateWeight(decimal newWeight)
        {
            if (newWeight <= 0)
                throw new ArgumentException("Weight must be greater than zero.");

            CurrentWeight = newWeight;
        }

        // Business Logic: Apnar requested Qurbani/Meat conversion-er jonno status change
        public void ProcessForSlaughter()
        {
            if (Status == AnimalStatus.Slaughtered || Status == AnimalStatus.SoldLive)
                throw new InvalidOperationException("Animal is already processed or sold.");

            Status = AnimalStatus.Slaughtered;

            // Ekhane amra Domain Event fire korbo jeta Inventory module shune mangsho toiri korbe
            // AddDomainEvent(new AnimalSlaughteredEvent(this.Id, this.CurrentWeight));
        }
    }
}
