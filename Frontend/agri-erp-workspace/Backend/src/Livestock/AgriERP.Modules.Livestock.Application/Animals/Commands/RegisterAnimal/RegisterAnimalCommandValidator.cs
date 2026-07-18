using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Animals.Commands.RegisterAnimal
{
    public class RegisterAnimalCommandValidator : AbstractValidator<RegisterAnimalCommand>
    {
        public RegisterAnimalCommandValidator()
        {
            RuleFor(x => x.TagNumber)
                .NotEmpty().WithMessage("Tag Number is required.")
                .MaximumLength(50).WithMessage("Tag Number cannot exceed 50 characters.");

            RuleFor(x => x.Species)
                .NotEmpty().WithMessage("Species is required.");

            RuleFor(x => x.InitialWeight)
                .GreaterThan(0).WithMessage("Initial weight must be greater than zero.");

            RuleFor(x => x.DateOfBirth)
                .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Date of Birth cannot be in the future.");
        }
    }
}
