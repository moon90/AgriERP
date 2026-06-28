using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.BuildingBlocks.Domain
{
    public interface IDomainEvent : INotification
    {
        Guid EventId { get; }
        DateTime OccurredOn { get; }
    }
}
