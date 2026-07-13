using AgriERP.Modules.Livestock.Domain.Events;
using AgriERP.Modules.Inventory.Domain.Entities;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AgriERP.Modules.Livestock.Application.Animals.EventHandlers
{
    // INotificationHandler দিয়ে MediatR-কে বোঝানো হচ্ছে যে এটি একটি ইভেন্ট লিসেনার
    public class AnimalSlaughteredEventHandler : INotificationHandler<AnimalSlaughteredEvent>
    {
        private readonly InventoryDbContext _inventoryContext;

        // সরাসরি ইনভেন্টরি কনটেক্সট ইনজেক্ট করা হলো (Cross-Module Communication)
        public AnimalSlaughteredEventHandler(InventoryDbContext inventoryContext)
        {
            _inventoryContext = inventoryContext;
        }

        public async Task Handle(AnimalSlaughteredEvent notification, CancellationToken cancellationToken)
        {
            try
            {
                var existingStock = await _inventoryContext.MeatStocks
                    .FirstOrDefaultAsync(x => x.ItemName == "Fresh Beef" && x.TenantId == notification.TenantId, cancellationToken);

                if (existingStock != null)
                {
                    existingStock.AddStock(notification.MeatYieldKg);
                }
                else
                {
                    var newStock = new MeatStock(notification.TenantId, "Fresh Beef", notification.MeatYieldKg);
                    await _inventoryContext.MeatStocks.AddAsync(newStock, cancellationToken);
                }

                // এটি ফোর্সড সেভ নিশ্চিত করবে
                await _inventoryContext.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                // যদি ডাটাবেস সেভ করতে কোনো এরর দেয় (যেমন স্কিমা বা ফরেন কি মিসম্যাচ), তবে কনসোলে প্রিন্ট হবে
                Console.WriteLine($"❌ [INVENTORY ERROR]: Could not save stock. Reason: {ex.Message}");
                throw;
            }
        }
    }
}
