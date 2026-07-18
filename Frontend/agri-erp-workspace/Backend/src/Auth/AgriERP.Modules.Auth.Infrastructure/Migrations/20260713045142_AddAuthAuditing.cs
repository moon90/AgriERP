using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgriERP.Modules.Auth.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthAuditing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "auth",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "auth",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                schema: "auth",
                table: "Users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "auth",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "auth",
                table: "Tenants",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                schema: "auth",
                table: "Tenants",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "auth",
                table: "Tenants",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "auth",
                table: "Roles",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "auth",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                schema: "auth",
                table: "Roles",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "auth",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "auth",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "auth",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                schema: "auth",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "auth",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "auth",
                table: "Tenants");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                schema: "auth",
                table: "Tenants");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "auth",
                table: "Tenants");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "auth",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "auth",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                schema: "auth",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "auth",
                table: "Roles");
        }
    }
}
