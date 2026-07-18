using MediatR;
using System;
using System.Collections.Generic;

namespace AgriERP.Modules.Livestock.Application.Breeding.Commands.RecordCalving
{
    public record BirthRecordDto(string Gender, decimal BirthWeight, string TagNumber, string Status);

    public record RecordCalvingCommand(
        Guid BreedingCycleId,
        DateTime CalvingDate,
        List<BirthRecordDto> BirthRecords) : IRequest;
}
