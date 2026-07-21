using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Weather.Application.Common;
using AgriERP.Modules.Weather.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Weather.Application.Weather.Commands.ConfigureFrostAlert
{
    public record ConfigureFrostAlertCommand(
        Guid FieldId,
        decimal TemperatureThreshold,
        string AlertEmail,
        bool IsAlertActive
    ) : IRequest<Guid>;

    public class ConfigureFrostAlertCommandHandler : IRequestHandler<ConfigureFrostAlertCommand, Guid>
    {
        private readonly IWeatherDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public ConfigureFrostAlertCommandHandler(IWeatherDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(ConfigureFrostAlertCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var existing = await _context.FrostAlertConfigs
                .FirstOrDefaultAsync(c => c.FieldId == request.FieldId && c.TenantId == tenantId, cancellationToken);

            if (existing != null)
            {
                existing.UpdateConfig(request.TemperatureThreshold, request.AlertEmail, request.IsAlertActive);
            }
            else
            {
                existing = new FrostAlertConfig(
                    tenantId,
                    request.FieldId,
                    request.TemperatureThreshold,
                    request.AlertEmail,
                    request.IsAlertActive
                );
                await _context.FrostAlertConfigs.AddAsync(existing, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);
            return existing.Id;
        }
    }
}
