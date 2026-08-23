using AgriERP.Modules.Livestock.Domain;
using AgriERP.Modules.Livestock.Domain.Enums;
using Xunit;

namespace AgriERP.Architecture.Tests;

public class VeterinarySchedulerTests
{
    [Fact]
    public void VaccinationSchedule_Flags_Overdue_When_ScheduledDate_Is_Past()
    {
        // Arrange
        var animalId = Guid.NewGuid();
        var vaccineItemId = Guid.NewGuid();
        var pastDate = DateTime.UtcNow.AddDays(-5);
        var schedule = new VaccinationSchedule(Guid.Empty, animalId, vaccineItemId, pastDate);

        // Act
        schedule.CheckOverdue();

        // Assert
        Assert.Equal("Overdue", schedule.Status);
    }

    [Fact]
    public void VaccinationSchedule_Complete_Sets_AdministeredDate_And_Completed_Status()
    {
        // Arrange
        var animalId = Guid.NewGuid();
        var schedule = new VaccinationSchedule(Guid.Empty, animalId, Guid.Empty, DateTime.UtcNow.AddDays(2));
        var administeredDate = DateTime.UtcNow;

        // Act
        schedule.Complete(administeredDate);

        // Assert
        Assert.Equal("Completed", schedule.Status);
        Assert.Equal(administeredDate, schedule.AdministeredDate);
    }

    [Fact]
    public void BreedingCycle_Calculates_283_Days_Expected_Calving_Date()
    {
        // Arrange
        var femaleId = Guid.NewGuid();
        var inseminationDate = new DateTime(2026, 1, 1);

        // Act
        var cycle = new BreedingCycle(Guid.Empty, femaleId, null, inseminationDate, "Artificial");

        // Assert
        Assert.NotNull(cycle.ExpectedCalvingDate);
        var differenceInDays = (cycle.ExpectedCalvingDate.Value.Date - inseminationDate.Date).TotalDays;
        Assert.Equal(283, differenceInDays);
        Assert.Equal("Active", cycle.Status);
    }

    [Fact]
    public void BreedingCycle_RecordPregnancyCheck_Positive_Maintains_Active_Status()
    {
        // Arrange
        var cycle = new BreedingCycle(Guid.Empty, Guid.NewGuid(), null, DateTime.UtcNow, "Artificial");
        var checkDate = DateTime.UtcNow.AddDays(45);

        // Act
        cycle.RecordPregnancyCheck(checkDate, "Positive");

        // Assert
        Assert.Equal("Positive", cycle.PregnancyResult);
        Assert.Equal("Active", cycle.Status);
        Assert.NotNull(cycle.ExpectedCalvingDate);
    }

    [Fact]
    public void BreedingCycle_RecordPregnancyCheck_Negative_Sets_Status_To_Failed()
    {
        // Arrange
        var cycle = new BreedingCycle(Guid.Empty, Guid.NewGuid(), null, DateTime.UtcNow, "Artificial");
        var checkDate = DateTime.UtcNow.AddDays(45);

        // Act
        cycle.RecordPregnancyCheck(checkDate, "Negative");

        // Assert
        Assert.Equal("Negative", cycle.PregnancyResult);
        Assert.Equal("Failed", cycle.Status);
        Assert.Null(cycle.ExpectedCalvingDate);
    }

    [Fact]
    public void BreedingCycle_RecordCalving_And_AddBirthRecord_Succeeds()
    {
        // Arrange
        var cycle = new BreedingCycle(Guid.Empty, Guid.NewGuid(), null, DateTime.UtcNow.AddDays(-283), "Artificial");
        cycle.RecordPregnancyCheck(DateTime.UtcNow.AddDays(-200), "Positive");
        var calvingDate = DateTime.UtcNow;

        // Act
        cycle.RecordCalving(calvingDate);
        cycle.AddBirthRecord("Heifer", 34.5m, "CALF-2026-99", "Healthy");

        // Assert
        Assert.Equal("Successful", cycle.Status);
        Assert.Equal(calvingDate, cycle.ActualCalvingDate);
        Assert.Single(cycle.BirthRecords);
        Assert.Equal("CALF-2026-99", cycle.BirthRecords.First().TagNumber);
        Assert.Equal(34.5m, cycle.BirthRecords.First().BirthWeight);
    }
}
