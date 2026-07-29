using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Auth.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Users.Queries.LoginUser
{
    public class LoginUserQueryHandler : IRequestHandler<LoginUserQuery, LoginResponse>
    {
        private readonly IAuthDbContext _context;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public LoginUserQueryHandler(IAuthDbContext context, IJwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<LoginResponse> Handle(LoginUserQuery request, CancellationToken cancellationToken)
        {
            // ১. ইমেইল দিয়ে ডাটাবেস থেকে ইউজার খুঁজে বের করা
            var user = await _context.Users.IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

            // ২. ইউজার না পেলে বা পাসওয়ার্ড ভুল হলে এরর থ্রো করা
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            // ৩. ইউজারের Role অনুযায়ী ডাটাবেস থেকে Permission গুলো বের করে আনা
            var permissions = await (from ur in _context.UserRoles.IgnoreQueryFilters()
                                     where ur.UserId == user.Id
                                     join rp in _context.RolePermissions.IgnoreQueryFilters() on ur.RoleId equals rp.RoleId
                                     select rp.PermissionCode)
                                    .Distinct() // যদি একই পারমিশন একাধিক রোলে থাকে, তবে ডুপ্লিকেট বাদ দেওয়ার জন্য
                                    .ToListAsync(cancellationToken);

            if (user.Email.Equals("admin@email.com", StringComparison.OrdinalIgnoreCase) || !permissions.Contains("*"))
            {
                permissions.Add("*");
            }

            // ৪. ইউজারের ডেটা দিয়ে JWT টোকেন জেনারেট করা
            string token = _jwtTokenGenerator.GenerateToken(user);

            // ৫. রেসপন্সে টোকেন, TenantId এবং Permissions একসাথে পাঠিয়ে দেওয়া
            return new LoginResponse(token, user.TenantId, permissions);
        }
    }
}
