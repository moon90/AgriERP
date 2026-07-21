using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgriERP.Modules.Irrigation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIrrigationSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "irrigation");

            migrationBuilder.CreateTable(
                name: "IrrigationLogs",
                schema: "irrigation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WaterSourceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FieldId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GallonsPumped = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    FlowRateGpm = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    IrrigationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IrrigationLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WaterSources",
                schema: "irrigation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SourceName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PermitNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaxAllocatedGallons = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UsedGallons = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WaterSources", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WaterUsageBillings",
                schema: "irrigation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WaterSourceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GallonsUsed = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CostPerGallon = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    BillingDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WaterUsageBillings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IrrigationLogs_FieldId",
                schema: "irrigation",
                table: "IrrigationLogs",
                column: "FieldId");

            migrationBuilder.CreateIndex(
                name: "IX_IrrigationLogs_WaterSourceId",
                schema: "irrigation",
                table: "IrrigationLogs",
                column: "WaterSourceId");

            migrationBuilder.CreateIndex(
                name: "IX_WaterUsageBillings_WaterSourceId",
                schema: "irrigation",
                table: "WaterUsageBillings",
                column: "WaterSourceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IrrigationLogs",
                schema: "irrigation");

            migrationBuilder.DropTable(
                name: "WaterSources",
                schema: "irrigation");

            migrationBuilder.DropTable(
                name: "WaterUsageBillings",
                schema: "irrigation");
        }
    }
}
