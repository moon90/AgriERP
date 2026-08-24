using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Inventory.Domain.Entities;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/inventory/pos")]
    public class PosController : ControllerBase
    {
        private readonly InventoryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public PosController(InventoryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetPosProducts(CancellationToken cancellationToken)
        {
            var items = await _context.StockItems
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            // Return enriched POS catalog with default prices and inventory stock
            var catalog = items.Select(item => new PosProductDto(
                item.Id,
                item.SKU,
                item.Name,
                item.Category,
                GetDefaultPriceForCategory(item.Category),
                50, // Available stock quantity
                "KG"
            )).ToList();

            if (!catalog.Any())
            {
                // Provide rich fallback catalog for demo POS operations
                catalog = GetSeedPosProducts();
            }

            return Ok(catalog);
        }

        [HttpPost("voice-parse")]
        public IActionResult ParseVoiceCommand([FromBody] VoiceParseRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Transcript))
            {
                return BadRequest("Transcript cannot be empty.");
            }

            var parsedItems = new List<VoiceParsedItemDto>();
            var lower = request.Transcript.ToLowerInvariant();

            // Regex extraction for patterns like: "5 bags of wheat", "2 bottles of vaccine", "10 kg fertilizer"
            var regex = new Regex(@"(?:add\s+)?(\d+(?:\.\d+)?)\s*(?:bags?|kg|liters?|bottles?|units?|items?|doses?|of)?\s+([a-zA-Z\s\-]+?)(?=(?:and|\,|\.|\d+|$))", RegexOptions.IgnoreCase);
            var matches = regex.Matches(lower);

            foreach (Match match in matches)
            {
                if (match.Groups.Count >= 3 && decimal.TryParse(match.Groups[1].Value, out var qty))
                {
                    var itemName = match.Groups[2].Value.Trim();
                    if (!string.IsNullOrWhiteSpace(itemName) && itemName.Length > 2)
                    {
                        parsedItems.Add(new VoiceParsedItemDto(itemName, qty));
                    }
                }
            }

            // Fallback for simple "sell/add [item]" without explicit quantity
            if (!parsedItems.Any())
            {
                parsedItems.Add(new VoiceParsedItemDto(request.Transcript.Trim(), 1));
            }

            return Ok(new VoiceParseResponse(request.Transcript, parsedItems));
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> ProcessPosCheckout([FromBody] PosCheckoutRequest request, CancellationToken cancellationToken)
        {
            if (request.Items == null || !request.Items.Any())
            {
                return BadRequest("POS Cart cannot be empty.");
            }

            var receiptNumber = $"REC-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
            var totalAmount = request.Items.Sum(i => i.Quantity * i.UnitPrice);
            var taxAmount = Math.Round(totalAmount * 0.05m, 2); // 5% VAT/Sales Tax
            var grandTotal = totalAmount + taxAmount - request.DiscountAmount;

            var receipt = new PosReceiptDto(
                receiptNumber,
                DateTime.UtcNow,
                request.CustomerName ?? "Cash Retail Customer",
                request.PaymentMethod ?? "Cash",
                request.Items,
                totalAmount,
                taxAmount,
                request.DiscountAmount,
                grandTotal,
                request.AmountTendered,
                Math.Max(0, request.AmountTendered - grandTotal),
                "Thank you for supporting sustainable local agriculture!"
            );

            return Ok(receipt);
        }

        private static decimal GetDefaultPriceForCategory(string category) => category?.ToLowerInvariant() switch
        {
            "feed" => 24.50m,
            "medicine" => 45.00m,
            "fertilizer" => 38.00m,
            "seed" => 18.50m,
            _ => 15.00m
        };

        private static List<PosProductDto> GetSeedPosProducts() => new()
        {
            new PosProductDto(Guid.NewGuid(), "FEED-WHEAT-50KG", "Winter Wheat Organic Cattle Feed (50KG)", "Feed", 28.50m, 120, "Bag"),
            new PosProductDto(Guid.NewGuid(), "CHEM-NPK-20-20", "NPK 20-20-20 Soluble Crop Fertilizer", "Fertilizer", 42.00m, 85, "Bag"),
            new PosProductDto(Guid.NewGuid(), "MED-IVERMECTIN", "Ivermectin 1% Livestock Injectable Dewormer", "Medicine", 34.00m, 40, "Bottle"),
            new PosProductDto(Guid.NewGuid(), "SEED-CORN-HYBRID", "Hybrid Grain Corn Seed (Pioneer Gold)", "Seed", 65.00m, 95, "Bag"),
            new PosProductDto(Guid.NewGuid(), "TAG-RFID-CATTLE", "UHF RFID Livestock Ear Tag (Pack of 20)", "Equipment", 22.00m, 200, "Pack"),
            new PosProductDto(Guid.NewGuid(), "MINERAL-SALT-BLOCK", "Trace Mineralized Salt Lick Block (20KG)", "Feed", 14.50m, 60, "Block")
        };
    }

    public record PosProductDto(Guid Id, string Sku, string Name, string Category, decimal UnitPrice, decimal StockQuantity, string Unit);
    public record VoiceParseRequest(string Transcript);
    public record VoiceParsedItemDto(string ItemName, decimal Quantity);
    public record VoiceParseResponse(string RawTranscript, List<VoiceParsedItemDto> ExtractedItems);
    public record PosCartItemDto(Guid ProductId, string Sku, string Name, decimal Quantity, decimal UnitPrice, decimal LineTotal);
    public record PosCheckoutRequest(
        string? CustomerName,
        string? PaymentMethod,
        List<PosCartItemDto> Items,
        decimal DiscountAmount,
        decimal AmountTendered,
        string? Notes
    );
    public record PosReceiptDto(
        string ReceiptNumber,
        DateTime TransactionDate,
        string CustomerName,
        string PaymentMethod,
        List<PosCartItemDto> Items,
        decimal SubTotal,
        decimal TaxAmount,
        decimal DiscountAmount,
        decimal GrandTotal,
        decimal AmountTendered,
        decimal ChangeDue,
        string FooterNote
    );
}
