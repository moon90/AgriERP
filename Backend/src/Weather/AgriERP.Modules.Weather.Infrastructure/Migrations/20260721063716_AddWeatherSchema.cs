using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgriERP.Modules.Weather.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWeatherSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "weather");

            migrationBuilder.CreateTable(
                name: "FrostAlertConfigs",
                schema: "weather",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FieldId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TemperatureThreshold = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    AlertEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsAlertActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FrostAlertConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WeatherReadings",
                schema: "weather",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WeatherStationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReadingTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TemperatureCelsius = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    HumidityPercentage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    WindSpeedKph = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PrecipitationMm = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    SoilMoisturePercentage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    IsFrostRisk = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeatherReadings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WeatherStations",
                schema: "weather",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StationName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LocationLatitude = table.Column<decimal>(type: "decimal(18,6)", precision: 18, scale: 6, nullable: false),
                    LocationLongitude = table.Column<decimal>(type: "decimal(18,6)", precision: 18, scale: 6, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeatherStations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WeatherSubscriptionBillings",
                schema: "weather",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubscriptionFee = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    BillingDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeatherSubscriptionBillings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FrostAlertConfigs_FieldId",
                schema: "weather",
                table: "FrostAlertConfigs",
                column: "FieldId");

            migrationBuilder.CreateIndex(
                name: "IX_WeatherReadings_WeatherStationId",
                schema: "weather",
                table: "WeatherReadings",
                column: "WeatherStationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FrostAlertConfigs",
                schema: "weather");

            migrationBuilder.DropTable(
                name: "WeatherReadings",
                schema: "weather");

            migrationBuilder.DropTable(
                name: "WeatherStations",
                schema: "weather");

            migrationBuilder.DropTable(
                name: "WeatherSubscriptionBillings",
                schema: "weather");
        }
    }
}
