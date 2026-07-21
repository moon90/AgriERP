using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgriERP.Modules.Crops.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCropsSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "crops");

            migrationBuilder.CreateTable(
                name: "CropCycles",
                schema: "crops",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FieldId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CropType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CropVariety = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlantingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HarvestDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpectedYieldTons = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ActualYieldTons = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    AccumulatedWipCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    HasTilled = table.Column<bool>(type: "bit", nullable: false),
                    HasFertilized = table.Column<bool>(type: "bit", nullable: false),
                    HasPesticided = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CropCycles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CropFields",
                schema: "crops",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AreaAcres = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    SoilType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CropFields", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FieldActivities",
                schema: "crops",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CropCycleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ActivityType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActivityDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Cost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    InputMaterialId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    InputQuantity = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FieldActivities", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CropCycles_FieldId",
                schema: "crops",
                table: "CropCycles",
                column: "FieldId");

            migrationBuilder.CreateIndex(
                name: "IX_FieldActivities_CropCycleId",
                schema: "crops",
                table: "FieldActivities",
                column: "CropCycleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CropCycles",
                schema: "crops");

            migrationBuilder.DropTable(
                name: "CropFields",
                schema: "crops");

            migrationBuilder.DropTable(
                name: "FieldActivities",
                schema: "crops");
        }
    }
}
