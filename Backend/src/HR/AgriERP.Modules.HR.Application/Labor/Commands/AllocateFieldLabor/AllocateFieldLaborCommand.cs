using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.HR.Application.Common;
using AgriERP.Modules.HR.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.HR.Application.Labor.Commands.AllocateFieldLabor
{
    public record AllocateFieldLaborCommand(
        Guid EmployeeId,
        Guid FieldId,
        DateTime AllocationDate,
        decimal HoursWorked,
        decimal HourlyRate,
        string ActivityType,
        string Notes
    ) : IRequest<Guid>;

    public class AllocateFieldLaborCommandHandler : IRequestHandler<AllocateFieldLaborCommand, Guid>
    {
        private readonly IHrDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public AllocateFieldLaborCommandHandler(
            IHrDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(AllocateFieldLaborCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Verify employee exists
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == request.EmployeeId && e.TenantId == tenantId, cancellationToken);

            if (employee == null)
            {
                throw new InvalidOperationException($"Employee with ID '{request.EmployeeId}' does not exist.");
            }

            var allocation = new FieldLaborAllocation(
                tenantId,
                request.EmployeeId,
                request.FieldId,
                request.AllocationDate,
                request.HoursWorked,
                request.HourlyRate,
                request.ActivityType,
                request.Notes
            );

            await _context.FieldLaborAllocations.AddAsync(allocation, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // Broadcast integration event for GL labor expense posting
            if (allocation.TotalLaborCost > 0)
            {
                var laborEvent = new FieldLaborAllocatedIntegrationEvent(
                    tenantId,
                    request.EmployeeId,
                    request.FieldId,
                    request.HoursWorked,
                    request.HourlyRate,
                    allocation.TotalLaborCost,
                    request.ActivityType,
                    request.AllocationDate
                );
                await _publisher.Publish(laborEvent, cancellationToken);
            }

            return allocation.Id;
        }
    }
}
