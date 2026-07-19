using AgriERP.Modules.HR.Application.Employees.Commands.CreateEmployee;
using AgriERP.Modules.HR.Application.TimeCards.Commands.LogTimeCard;
using AgriERP.Modules.HR.Application.TimeCards.Commands.ApproveTimeCards;
using AgriERP.Modules.HR.Application.Payroll.Commands.ProcessPayroll;
using AgriERP.Modules.HR.Application.Payroll.Commands.PayPayroll;
using AgriERP.Modules.HR.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.HR.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/hr/employees")]
    public class EmployeesController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IHrDbContext _context;

        public EmployeesController(ISender sender, IHrDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployees(CancellationToken cancellationToken)
        {
            var employees = await _context.Employees
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return Ok(employees);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeCommand command, CancellationToken cancellationToken)
        {
            var id = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/hr/employees/{id}", new { Id = id });
        }

        [HttpGet("timecards")]
        public async Task<IActionResult> GetTimeCards(CancellationToken cancellationToken)
        {
            var timeCards = await _context.TimeCards
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return Ok(timeCards);
        }

        [HttpPost("timecards")]
        public async Task<IActionResult> LogTimeCard([FromBody] LogTimeCardCommand command, CancellationToken cancellationToken)
        {
            var cardId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/hr/employees/timecards/{cardId}", new { Id = cardId });
        }

        [HttpPost("timecards/approve")]
        public async Task<IActionResult> ApproveTimeCards([FromBody] ApproveTimeCardsCommand command, CancellationToken cancellationToken)
        {
            var success = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = success, Message = "Time cards approved successfully." });
        }

        [HttpGet("payroll/periods")]
        public async Task<IActionResult> GetPayrollPeriods(CancellationToken cancellationToken)
        {
            var periods = await _context.PayrollPeriods
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return Ok(periods);
        }

        [HttpGet("payroll/payslips")]
        public async Task<IActionResult> GetPayslips(CancellationToken cancellationToken)
        {
            var payslips = await _context.Payslips
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return Ok(payslips);
        }

        [HttpPost("payroll/runs")]
        public async Task<IActionResult> ProcessPayroll([FromBody] ProcessPayrollCommand command, CancellationToken cancellationToken)
        {
            var periodId = await _sender.Send(command, cancellationToken);
            return Ok(new { PayrollPeriodId = periodId, Message = "Payroll processed successfully." });
        }

        [HttpPost("payroll/runs/{id}/pay")]
        public async Task<IActionResult> PayPayroll(Guid id, CancellationToken cancellationToken)
        {
            var command = new PayPayrollCommand(id);
            var success = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = success, Message = "Payroll paid and general ledger postings executed." });
        }
    }
}
