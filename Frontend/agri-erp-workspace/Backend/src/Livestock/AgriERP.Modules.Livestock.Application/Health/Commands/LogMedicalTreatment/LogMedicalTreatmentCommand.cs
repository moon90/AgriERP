using MediatR;
using System;
using System.Collections.Generic;

namespace AgriERP.Modules.Livestock.Application.Health.Commands.LogMedicalTreatment
{
    public record AdministeredDrugDto(Guid StockItemId, decimal Quantity, string DosageInstruction, int WithdrawalPeriodDays);

    public record LogMedicalTreatmentCommand(
        Guid AnimalId,
        string Diagnosis,
        string Notes,
        List<AdministeredDrugDto> Drugs) : IRequest<Guid>;
}
