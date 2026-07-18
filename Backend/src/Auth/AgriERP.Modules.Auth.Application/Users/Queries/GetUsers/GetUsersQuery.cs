using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Users.Queries.GetUsers
{
    // ফ্রন্টএন্ডে যে ডেটাগুলো পাঠানো হবে
    public record UserDto(Guid Id, string Email, string FullName, bool IsActive);

    // কোয়েরি রিকোয়েস্ট (এখানে কোনো প্যারামিটার লাগছে না কারণ TenantId আমরা প্রোভাইডার থেকে নেব)
    public record GetUsersQuery() : IRequest<List<UserDto>>;
}
