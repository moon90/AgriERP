using MediatR;

namespace AgriERP.Modules.Auth.Application.Roles.Queries.GetRoles;

public record RoleDto(Guid Id, string Name);
public record GetRolesQuery() : IRequest<List<RoleDto>>;