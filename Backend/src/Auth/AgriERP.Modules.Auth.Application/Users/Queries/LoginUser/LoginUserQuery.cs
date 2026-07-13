using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Users.Queries.LoginUser
{
    // এটি আমাদের নতুন রেসপন্স অবজেক্ট, যেখানে টোকেন এবং ট্যানেন্ট আইডি দুটোই থাকবে
    // পারমিশন লিস্ট যুক্ত করা হলো
    public record LoginResponse(string AccessToken, Guid TenantId, List<string> Permissions);

    // এটি লগইন রিকোয়েস্টের ডেটা বহন করবে
    public record LoginUserQuery(string Email, string Password) : IRequest<LoginResponse>;
}
