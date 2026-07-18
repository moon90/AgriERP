using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AgriERP.Modules.Finance.Domain
{
    public class JournalEntry : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public DateTime PostDate { get; private set; }
        public string Description { get; private set; }
        public bool IsPosted { get; private set; }

        private readonly List<TransactionLine> _lines = new();
        public virtual IReadOnlyCollection<TransactionLine> Lines => _lines.AsReadOnly();

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected JournalEntry() 
        {
            Description = null!;
        }

        public JournalEntry(Guid tenantId, DateTime postDate, string description)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            PostDate = postDate;
            Description = description ?? throw new ArgumentNullException(nameof(description));
            IsPosted = false;
        }

        public void AddLine(Guid accountId, decimal debitAmount, decimal creditAmount, string currency = "USD", decimal exchangeRate = 1.0m)
        {
            if (IsPosted)
                throw new InvalidOperationException("Cannot add lines to a posted journal entry.");

            var line = new TransactionLine(Id, accountId, debitAmount, creditAmount, currency, exchangeRate);
            _lines.Add(line);
        }

        public void Post()
        {
            if (IsPosted)
                throw new InvalidOperationException("The journal entry is already posted.");

            if (!_lines.Any())
                throw new InvalidOperationException("Cannot post a journal entry with no lines.");

            // Verify double-entry balancing logic (Sum(Debits in Base Currency) == Sum(Credits in Base Currency))
            var totalDebitsBase = _lines.Sum(l => l.DebitAmount * l.ExchangeRate);
            var totalCreditsBase = _lines.Sum(l => l.CreditAmount * l.ExchangeRate);

            if (Math.Abs(totalDebitsBase - totalCreditsBase) > 0.001m)
            {
                throw new InvalidOperationException($"Unbalanced Journal Entry! Total Debits: {totalDebitsBase}, Total Credits: {totalCreditsBase} in base currency.");
            }

            IsPosted = true;
        }
    }
}
