using System;
using System.Threading;
using System.Threading.Tasks;
using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.HR.Application.Common;
using AgriERP.Modules.HR.Domain;
using MediatR;

namespace AgriERP.Modules.HR.Application.Employees.Commands.CreateEmployee
{
    public record CreateEmployeeCommand(
        string FirstName,
        string LastName,
        string Email,
        string Phone,
        string Role,
        decimal BaseHourlyRate,
        decimal MonthlySalary,
        bool IsHourly
    ) : IRequest<Guid>;

    public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, Guid>
    {
        private readonly IHrDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateEmployeeCommandHandler(IHrDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            
            var employee = new Employee(
                tenantId,
                request.FirstName,
                request.LastName,
                request.Email,
                request.Phone,
                request.Role,
                request.BaseHourlyRate,
                request.MonthlySalary,
                request.IsHourly
            );

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync(cancellationToken);

            return employee.Id;
        }
    }
}
