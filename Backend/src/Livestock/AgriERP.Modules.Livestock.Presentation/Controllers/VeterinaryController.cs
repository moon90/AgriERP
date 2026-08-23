using AgriERP.Modules.Auth.Presentation.Authorization;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Domain;
using AgriERP.Modules.Livestock.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgriERP.Modules.Livestock.Presentation.Controllers;

public record ScheduleVaccinationRequest(
    Guid AnimalId,
    Guid VaccineItemId,
    DateTime ScheduledDate
);

public record CompleteVaccinationRequest(
    DateTime AdministeredDate
);

public record RecordInseminationRequest(
    Guid FemaleAnimalId,
    Guid? MaleAnimalId,
    DateTime InseminationDate,
    string InseminationType
);

public record RecordPregnancyCheckRequest(
    DateTime CheckDate,
    string Result
);

public record RecordCalvingRequest(
    DateTime CalvingDate,
    string Gender,
    decimal BirthWeight,
    string TagNumber,
    string Status
);

public record VaccinationScheduleDto(
    Guid Id,
    Guid AnimalId,
    string AnimalTag,
    Guid VaccineItemId,
    string VaccineName,
    DateTime ScheduledDate,
    DateTime? AdministeredDate,
    string Status
);

public record BreedingCycleDto(
    Guid Id,
    Guid FemaleAnimalId,
    string FemaleAnimalTag,
    Guid? MaleAnimalId,
    string? MaleAnimalTag,
    DateTime InseminationDate,
    string InseminationType,
    string Status,
    DateTime? PregnancyCheckDate,
    string? PregnancyResult,
    DateTime? ExpectedCalvingDate,
    DateTime? ActualCalvingDate
);

[Authorize]
[ApiController]
[Route("api/v1/livestock/[controller]")]
public class VeterinaryController : ControllerBase
{
    private readonly ILivestockDbContext _context;

    public VeterinaryController(ILivestockDbContext context)
    {
        _context = context;
    }

    [HttpGet("vaccinations")]
    [RequirePermission("Animal.View")]
    public async Task<IActionResult> GetVaccinations(CancellationToken cancellationToken)
    {
        var schedules = await _context.VaccinationSchedules.AsNoTracking().ToListAsync(cancellationToken);
        var animals = await _context.Animals.AsNoTracking().ToDictionaryAsync(a => a.Id, a => a.TagNumber, cancellationToken);

        // Auto-check overdue
        foreach (var s in schedules)
        {
            s.CheckOverdue();
        }

        var result = schedules.Select(s => new VaccinationScheduleDto(
            s.Id,
            s.AnimalId,
            animals.TryGetValue(s.AnimalId, out var tag) ? tag : s.AnimalId.ToString().Substring(0, 8),
            s.VaccineItemId,
            s.VaccineItemId == Guid.Empty ? "FMD & Anthrax Booster" : "Vaccine Catalog Dose",
            s.ScheduledDate,
            s.AdministeredDate,
            s.Status
        )).OrderBy(s => s.ScheduledDate).ToList();

        return Ok(result);
    }

    [HttpPost("vaccinations")]
    [RequirePermission("Animal.Create")]
    public async Task<IActionResult> ScheduleVaccination([FromBody] ScheduleVaccinationRequest request, CancellationToken cancellationToken)
    {
        var schedule = new VaccinationSchedule(
            Guid.Empty,
            request.AnimalId,
            request.VaccineItemId,
            request.ScheduledDate
        );

        _context.VaccinationSchedules.Add(schedule);
        await _context.SaveChangesAsync(cancellationToken);

        return Created($"/api/v1/livestock/veterinary/vaccinations/{schedule.Id}", new { Id = schedule.Id });
    }

    [HttpPost("vaccinations/{id:guid}/complete")]
    [RequirePermission("Animal.Create")]
    public async Task<IActionResult> CompleteVaccination(Guid id, [FromBody] CompleteVaccinationRequest request, CancellationToken cancellationToken)
    {
        var schedule = await _context.VaccinationSchedules.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (schedule == null)
            return NotFound(new { Message = "Vaccination schedule not found." });

        schedule.Complete(request.AdministeredDate);
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new { Message = "Vaccination marked completed successfully." });
    }

    [HttpGet("breeding-cycles")]
    [RequirePermission("Animal.View")]
    public async Task<IActionResult> GetBreedingCycles(CancellationToken cancellationToken)
    {
        var cycles = await _context.BreedingCycles.AsNoTracking().ToListAsync(cancellationToken);
        var animals = await _context.Animals.AsNoTracking().ToDictionaryAsync(a => a.Id, a => a.TagNumber, cancellationToken);

        var result = cycles.Select(c => new BreedingCycleDto(
            c.Id,
            c.FemaleAnimalId,
            animals.TryGetValue(c.FemaleAnimalId, out var fTag) ? fTag : c.FemaleAnimalId.ToString().Substring(0, 8),
            c.MaleAnimalId,
            c.MaleAnimalId.HasValue && animals.TryGetValue(c.MaleAnimalId.Value, out var mTag) ? mTag : null,
            c.InseminationDate,
            c.InseminationType,
            c.Status,
            c.PregnancyCheckDate,
            c.PregnancyResult,
            c.ExpectedCalvingDate,
            c.ActualCalvingDate
        )).OrderByDescending(c => c.InseminationDate).ToList();

        return Ok(result);
    }

    [HttpPost("breeding-cycles")]
    [RequirePermission("Animal.Create")]
    public async Task<IActionResult> RecordInsemination([FromBody] RecordInseminationRequest request, CancellationToken cancellationToken)
    {
        var cycle = new BreedingCycle(
            Guid.Empty,
            request.FemaleAnimalId,
            request.MaleAnimalId,
            request.InseminationDate,
            request.InseminationType
        );

        _context.BreedingCycles.Add(cycle);
        await _context.SaveChangesAsync(cancellationToken);

        return Created($"/api/v1/livestock/veterinary/breeding-cycles/{cycle.Id}", new { Id = cycle.Id, ExpectedCalvingDate = cycle.ExpectedCalvingDate });
    }

    [HttpPost("breeding-cycles/{id:guid}/pregnancy-check")]
    [RequirePermission("Animal.Create")]
    public async Task<IActionResult> RecordPregnancyCheck(Guid id, [FromBody] RecordPregnancyCheckRequest request, CancellationToken cancellationToken)
    {
        var cycle = await _context.BreedingCycles.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (cycle == null)
            return NotFound(new { Message = "Breeding cycle not found." });

        cycle.RecordPregnancyCheck(request.CheckDate, request.Result);
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new { Message = "Pregnancy check recorded successfully." });
    }

    [HttpPost("breeding-cycles/{id:guid}/calving")]
    [RequirePermission("Animal.Create")]
    public async Task<IActionResult> RecordCalving(Guid id, [FromBody] RecordCalvingRequest request, CancellationToken cancellationToken)
    {
        var cycle = await _context.BreedingCycles.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (cycle == null)
            return NotFound(new { Message = "Breeding cycle not found." });

        cycle.RecordCalving(request.CalvingDate);
        cycle.AddBirthRecord(request.Gender, request.BirthWeight, request.TagNumber, request.Status);

        // Register newborn animal in inventory
        var calf = Animal.Register(
            Guid.Empty,
            request.TagNumber,
            "Cattle",
            AnimalPurpose.Dairy,
            request.CalvingDate,
            request.BirthWeight
        );
        _context.Animals.Add(calf);

        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new { Message = "Calving recorded and newborn calf registered into inventory." });
    }
}
