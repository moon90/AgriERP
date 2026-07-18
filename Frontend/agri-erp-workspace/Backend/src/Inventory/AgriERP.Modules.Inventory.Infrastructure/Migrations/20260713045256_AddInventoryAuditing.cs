using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgriERP.Modules.Inventory.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryAuditing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "inventory",
                table: "MeatStocks",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "inventory",
                table: "MeatStocks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                schema: "inventory",
                table: "MeatStocks",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "inventory",
                table: "MeatStocks",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "inventory",
                table: "MeatStocks");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "inventory",
                table: "MeatStocks");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                schema: "inventory",
                table: "MeatStocks");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "inventory",
                table: "MeatStocks");
        }
    }
}
