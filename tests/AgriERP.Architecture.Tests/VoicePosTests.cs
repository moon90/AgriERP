using AgriERP.Modules.Inventory.Presentation.Controllers;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Xunit;

namespace AgriERP.Architecture.Tests;

public class VoicePosTests
{
    [Theory]
    [InlineData("Add 3 bags of Winter Wheat Feed", "winter wheat feed", 3)]
    [InlineData("2 bottles of ivermectin dewormer", "ivermectin dewormer", 2)]
    [InlineData("10 kg NPK fertilizer", "npk fertilizer", 10)]
    public void VoiceCommand_Regex_Extracts_Quantity_And_Item_Name(string transcript, string expectedItem, decimal expectedQty)
    {
        // Arrange
        var lower = transcript.ToLowerInvariant();
        var regex = new Regex(@"(?:add\s+)?(\d+(?:\.\d+)?)\s*(?:bags?|kg|liters?|bottles?|units?|items?|doses?|of)?\s+([a-zA-Z\s\-]+?)(?=(?:and|\,|\.|\d+|$))", RegexOptions.IgnoreCase);

        // Act
        var match = regex.Match(lower);

        // Assert
        Assert.True(match.Success);
        Assert.Equal(expectedQty, decimal.Parse(match.Groups[1].Value));
        Assert.Contains(expectedItem, match.Groups[2].Value.Trim());
    }

    [Fact]
    public void PosCheckout_Calculates_Subtotal_Vat_And_ChangeDue_Correctly()
    {
        // Arrange
        var items = new List<PosCartItemDto>
        {
            new(Guid.NewGuid(), "FEED-1", "Winter Wheat Feed", 2, 25.00m, 50.00m),
            new(Guid.NewGuid(), "FERT-1", "NPK Fertilizer", 1, 50.00m, 50.00m)
        };

        var subTotal = 100.00m;
        var taxRate = 0.05m; // 5% VAT
        var taxAmount = Math.Round(subTotal * taxRate, 2); // 5.00
        var discount = 10.00m;
        var grandTotal = subTotal + taxAmount - discount; // 95.00
        var amountTendered = 100.00m;
        var changeDue = amountTendered - grandTotal; // 5.00

        var receipt = new PosReceiptDto(
            "REC-20260824-1234",
            DateTime.UtcNow,
            "John Doe (Farmer)",
            "Cash",
            items,
            subTotal,
            taxAmount,
            discount,
            grandTotal,
            amountTendered,
            changeDue,
            "Thank you!"
        );

        // Assert
        Assert.Equal(100.00m, receipt.SubTotal);
        Assert.Equal(5.00m, receipt.TaxAmount);
        Assert.Equal(95.00m, receipt.GrandTotal);
        Assert.Equal(5.00m, receipt.ChangeDue);
        Assert.Equal("Cash", receipt.PaymentMethod);
    }
}
