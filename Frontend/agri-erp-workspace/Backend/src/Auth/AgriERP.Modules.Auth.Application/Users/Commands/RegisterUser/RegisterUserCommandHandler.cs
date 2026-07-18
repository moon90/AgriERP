using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Auth.Application.Common.Interfaces;
using AgriERP.Modules.Auth.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Users.Commands.RegisterUser
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Guid>
    {
        private readonly IAuthDbContext _context; // সরাসরি ক্লাসের বদলে ইন্টারফেস ব্যবহার
        private readonly ITenantProvider _tenantProvider;

        public RegisterUserCommandHandler(IAuthDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var currentTenantId = _tenantProvider.TenantId;

            // ১. চেক করা যে এই ট্যানেন্টে একই ইমেইল দিয়ে কোনো অ্যাকাউন্ট আছে কি না
            var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email && u.TenantId == currentTenantId, cancellationToken);

            if (emailExists)
            {
                throw new InvalidOperationException("Email already exists in this tenant!");
            }

            // ২. পাসওয়ার্ড হ্যাশ (Hash) করা (BCrypt ব্যবহার করে)
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // ৩. নতুন ইউজার এনটিটি তৈরি করা
            var user = new User(currentTenantId, request.Email, passwordHash, request.FullName);

            // ৪. ডাটাবেসে সেভ করা
            await _context.Users.AddAsync(user, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return user.Id;
        }
    }
}
