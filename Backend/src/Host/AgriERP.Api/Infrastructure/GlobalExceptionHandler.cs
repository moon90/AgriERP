using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Api.Infrastructure
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            ProblemDetails problemDetails;
            int statusCode;

            switch (exception)
            {
                case ValidationException valEx:
                    statusCode = StatusCodes.Status400BadRequest;
                    problemDetails = new ValidationProblemDetails(
                        valEx.Errors.GroupBy(e => e.PropertyName, e => e.ErrorMessage)
                            .ToDictionary(g => g.Key, g => g.ToArray()))
                    {
                        Status = statusCode,
                        Title = "Validation Error",
                        Detail = "One or more validation errors occurred.",
                        Instance = httpContext.Request.Path
                    };
                    break;

                case KeyNotFoundException knfEx:
                    statusCode = StatusCodes.Status404NotFound;
                    problemDetails = new ProblemDetails
                    {
                        Status = statusCode,
                        Title = "Resource Not Found",
                        Detail = knfEx.Message,
                        Instance = httpContext.Request.Path
                    };
                    break;

                case UnauthorizedAccessException uaeEx:
                    statusCode = StatusCodes.Status401Unauthorized;
                    problemDetails = new ProblemDetails
                    {
                        Status = statusCode,
                        Title = "Unauthorized",
                        Detail = uaeEx.Message,
                        Instance = httpContext.Request.Path
                    };
                    break;

                case InvalidOperationException invEx:
                    statusCode = StatusCodes.Status400BadRequest;
                    problemDetails = new ProblemDetails
                    {
                        Status = statusCode,
                        Title = "Bad Request",
                        Detail = invEx.Message,
                        Instance = httpContext.Request.Path
                    };
                    break;

                default:
                    statusCode = StatusCodes.Status500InternalServerError;
                    problemDetails = new ProblemDetails
                    {
                        Status = statusCode,
                        Title = "Internal Server Error",
                        Detail = "An unexpected error occurred while processing your request.",
                        Instance = httpContext.Request.Path
                    };
                    break;
            }

            httpContext.Response.StatusCode = statusCode;
            httpContext.Response.ContentType = "application/problem+json";
            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

            return true;
        }
    }
}
