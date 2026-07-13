using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgriERP.Modules.Livestock.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialSqlServer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "livestock");

            migrationBuilder.CreateTable(
                name: "Animals",
                schema: "livestock",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TagNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Species = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Purpose = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CurrentWeight = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Animals", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Animals_TagNumber",
                schema: "livestock",
                table: "Animals",
                column: "TagNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Animals",
                schema: "livestock");
        }
    }
}
