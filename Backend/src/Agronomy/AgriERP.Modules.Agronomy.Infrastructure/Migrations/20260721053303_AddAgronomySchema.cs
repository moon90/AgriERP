using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgriERP.Modules.Agronomy.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAgronomySchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "agronomy");

            migrationBuilder.CreateTable(
                name: "AgronomyRecommendations",
                schema: "agronomy",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SoilSampleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RecommendedFertilizerType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TargetApplicationRate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    RecommendationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AgronomistName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgronomyRecommendations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LabTestingBillings",
                schema: "agronomy",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SoilSampleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TestFee = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    BillingDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabTestingBillings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SoilSamples",
                schema: "agronomy",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FieldId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SampleCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SampleDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LabName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhLevel = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NitrogenPpm = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PhosphorusPpm = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PotassiumPpm = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    OrganicMatterPercentage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoilSamples", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AgronomyRecommendations_SoilSampleId",
                schema: "agronomy",
                table: "AgronomyRecommendations",
                column: "SoilSampleId");

            migrationBuilder.CreateIndex(
                name: "IX_LabTestingBillings_SoilSampleId",
                schema: "agronomy",
                table: "LabTestingBillings",
                column: "SoilSampleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AgronomyRecommendations",
                schema: "agronomy");

            migrationBuilder.DropTable(
                name: "LabTestingBillings",
                schema: "agronomy");

            migrationBuilder.DropTable(
                name: "SoilSamples",
                schema: "agronomy");
        }
    }
}
