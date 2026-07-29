using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.HR.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.HR.Application.Labor.Queries.GetFieldLaborAnalytics
{
    public record FieldLaborAllocationDto(
        Guid Id,
        Guid EmployeeId,
        string EmployeeName,
        Guid FieldId,
        DateTime AllocationDate,
        decimal HoursWorked,
        decimal HourlyRate,
        decimal TotalLaborCost,
        string ActivityType,
        string Notes
    );

    public record FieldLaborAnalyticsDto(
        List<FieldLaborAllocationDto> Allocations,
        decimal TotalLaborHours,
        decimal TotalLaborExpense,
        int TotalFieldsWorked
    );

    public record GetFieldLaborAnalyticsQuery : IRequest<FieldLaborAnalyticsDto>;

    public class GetFieldLaborAnalyticsQueryHandler : IRequestHandler<GetFieldLaborAnalyticsQuery, FieldLaborAnalyticsDto>
    {
        private readonly IHrDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetFieldLaborAnalyticsQueryHandler(IHrDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<FieldLaborAnalyticsDto> Handle(GetFieldLaborAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var employees = await _context.Employees
                .AsNoTracking()
                .Where(e => e.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var allocations = await _context.FieldLaborAllocations
                .AsNoTracking()
                .Where(a => a.TenantId == tenantId)
                .OrderByDescending(a => a.AllocationDate)
                .ToListAsync(cancellationToken);

            var dtos = allocations.Select(a => {
                var emp = employees.FirstOrDefault(e => e.Id == a.EmployeeId);
                return new FieldLaborAllocationDto(
                    a.Id,
                    a.EmployeeId,
                    emp != null ? $"{emp.FirstName} {emp.LastName}" : "Unknown Employee",
                    a.FieldId,
                    a.AllocationDate,
                    a.HoursWorked,
                    a.HourlyRate,
                    a.TotalLaborCost,
                    a.ActivityType,
                    a.Notes
                );
            }).ToList();

            decimal totalHours = dtos.Sum(d => d.HoursWorked);
            decimal totalExpense = dtos.Sum(d => d.TotalLaborCost);
            int uniqueFields = dtos.Select(d => d.FieldId).Distinct().Count();

            return new FieldLaborAnalyticsDto(
                dtos,
                totalHours,
                totalExpense,
                uniqueFields
            );
        }
    }
}
