using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Finance.Domain
{
    public class TransactionLine : Entity
    {
        public Guid JournalEntryId { get; private set; }
        public Guid AccountId { get; private set; }
        public decimal DebitAmount { get; private set; }
        public decimal CreditAmount { get; private set; }
        public string Currency { get; private set; }
        public decimal ExchangeRate { get; private set; }

        protected TransactionLine() 
        {
            Currency = null!;
        }

        public TransactionLine(Guid journalEntryId, Guid accountId, decimal debitAmount, decimal creditAmount, string currency, decimal exchangeRate)
        {
            Id = Guid.NewGuid();
            JournalEntryId = journalEntryId;
            AccountId = accountId;
            DebitAmount = debitAmount >= 0 ? debitAmount : throw new ArgumentException("Debit amount cannot be negative.");
            CreditAmount = creditAmount >= 0 ? creditAmount : throw new ArgumentException("Credit amount cannot be negative.");
            Currency = string.IsNullOrWhiteSpace(currency) ? "USD" : currency.ToUpper();
            ExchangeRate = exchangeRate > 0 ? exchangeRate : throw new ArgumentException("Exchange rate must be greater than zero.");

            if (DebitAmount > 0 && CreditAmount > 0)
            {
                throw new ArgumentException("A single transaction line cannot have both a debit and a credit amount.");
            }
            if (DebitAmount == 0 && CreditAmount == 0)
            {
                throw new ArgumentException("A transaction line must have either a debit or a credit amount.");
            }
        }
    }
}
