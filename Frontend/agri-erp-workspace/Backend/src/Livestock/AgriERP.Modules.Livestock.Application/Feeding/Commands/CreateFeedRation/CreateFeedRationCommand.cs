using MediatR;
using System;
using System.Collections.Generic;

namespace AgriERP.Modules.Livestock.Application.Feeding.Commands.CreateFeedRation
{
    public record FeedRationItemDto(Guid StockItemId, decimal Percentage);

    public record CreateFeedRationCommand(
        string Name,
        string TargetSpecies,
        List<FeedRationItemDto> FeedItems) : IRequest<Guid>;
}
