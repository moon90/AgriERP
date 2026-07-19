using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgriERP.Modules.Inventory.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class OptimizeInventoryIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "inventory",
                table: "StockBatches",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                schema: "inventory",
                table: "SalesOrders",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                schema: "inventory",
                table: "PurchaseOrders",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_StockMovements_StockBatchId",
                schema: "inventory",
                table: "StockMovements",
                column: "StockBatchId");

            migrationBuilder.CreateIndex(
                name: "IX_StockBatches_StockItemId",
                schema: "inventory",
                table: "StockBatches",
                column: "StockItemId");

            migrationBuilder.CreateIndex(
                name: "IX_StockBatches_WarehouseId",
                schema: "inventory",
                table: "StockBatches",
                column: "WarehouseId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrders_CustomerId",
                schema: "inventory",
                table: "SalesOrders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrders_Status",
                schema: "inventory",
                table: "SalesOrders",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrderItems_StockItemId",
                schema: "inventory",
                table: "SalesOrderItems",
                column: "StockItemId");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_Status",
                schema: "inventory",
                table: "PurchaseOrders",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_VendorId",
                schema: "inventory",
                table: "PurchaseOrders",
                column: "VendorId");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderItems_StockItemId",
                schema: "inventory",
                table: "PurchaseOrderItems",
                column: "StockItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StockMovements_StockBatchId",
                schema: "inventory",
                table: "StockMovements");

            migrationBuilder.DropIndex(
                name: "IX_StockBatches_StockItemId",
                schema: "inventory",
                table: "StockBatches");

            migrationBuilder.DropIndex(
                name: "IX_StockBatches_WarehouseId",
                schema: "inventory",
                table: "StockBatches");

            migrationBuilder.DropIndex(
                name: "IX_SalesOrders_CustomerId",
                schema: "inventory",
                table: "SalesOrders");

            migrationBuilder.DropIndex(
                name: "IX_SalesOrders_Status",
                schema: "inventory",
                table: "SalesOrders");

            migrationBuilder.DropIndex(
                name: "IX_SalesOrderItems_StockItemId",
                schema: "inventory",
                table: "SalesOrderItems");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrders_Status",
                schema: "inventory",
                table: "PurchaseOrders");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrders_VendorId",
                schema: "inventory",
                table: "PurchaseOrders");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrderItems_StockItemId",
                schema: "inventory",
                table: "PurchaseOrderItems");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "inventory",
                table: "StockBatches");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                schema: "inventory",
                table: "SalesOrders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                schema: "inventory",
                table: "PurchaseOrders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
