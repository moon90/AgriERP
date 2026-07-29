using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Auth.Domain.Entities
{
    public class OutboxMessage : Entity
    {
        public string Type { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime OccurredOn { get; set; }
        public DateTime? ProcessedOn { get; set; }
        public string? Error { get; set; }
    }
}
