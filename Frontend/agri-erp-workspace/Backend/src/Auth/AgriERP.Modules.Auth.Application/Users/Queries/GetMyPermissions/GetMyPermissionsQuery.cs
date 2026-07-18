using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Users.Queries.GetMyPermissions
{
    public record GetMyPermissionsQuery(Guid UserId) : IRequest<List<string>>;
}
