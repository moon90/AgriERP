using MediatR;

namespace AgriERP.Modules.Auth.Application.Roles.Commands.CreateRole;

// অ্যাডমিন রোলের নাম, বিবরণ এবং সিলেক্ট করা পারমিশনগুলোর কোড (String array) পাঠাবে
public record CreateRoleCommand(
    string Name,
    string Description,
    List<string> PermissionCodes) : IRequest<Guid>;