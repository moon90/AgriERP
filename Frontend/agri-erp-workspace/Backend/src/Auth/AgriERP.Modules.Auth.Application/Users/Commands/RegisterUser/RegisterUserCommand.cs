using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Users.Commands.RegisterUser
{
    // এটি একটি Command যা ইউজারের ডেটা বহন করবে এবং শেষে ইউজারের Id (Guid) রিটার্ন করবে
    public record RegisterUserCommand(
        string Email,
        string Password,
        string FullName) : IRequest<Guid>;
}
