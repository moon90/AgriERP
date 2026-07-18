using MediatR;
using System;

namespace AgriERP.Modules.Livestock.Application.Feeding.Commands.LogFeedingActivity
{
    public record LogFeedingActivityCommand(
        Guid FeedRationId,
        Guid PenOrBarnId,
        decimal QuantityFed) : IRequest<Guid>;
}
