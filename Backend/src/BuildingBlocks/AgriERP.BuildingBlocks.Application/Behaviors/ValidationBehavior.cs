using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace AgriERP.BuildingBlocks.Application.Behaviors
{
    public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : notnull
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;

        public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        {
            _validators = validators;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            if (!_validators.Any())
            {
                return await next(); // কোনো ভ্যালিডেটর না থাকলে সোজা হ্যান্ডলারে চলে যাবে
            }

            var context = new ValidationContext<TRequest>(request);

            // সবগুলো ভ্যালিডেটর রান করানো
            var validationResults = await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

            var failures = validationResults
                .Where(r => r.Errors.Any())
                .SelectMany(r => r.Errors)
                .ToList();

            if (failures.Any())
            {
                // যদি এরর থাকে, তবে কাস্টম Exception থ্রো করবে
                throw new FluentValidation.ValidationException(failures);
            }

            // সব ঠিক থাকলে আসল হ্যান্ডলারে রিকোয়েস্ট পাস করে দেবে
            return await next();
        }
    }
}
