using AgriERP.Modules.Auth.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AgriERP.Modules.Auth.Application.Roles.Queries.GetRoles;

public class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, List<RoleDto>>
{
    private readonly IAuthDbContext _context;

    public GetRolesQueryHandler(IAuthDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoleDto>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        // যেহেতু DbContext-এ Global Query Filter বসানো আছে, 
        // তাই এটি অটোমেটিক শুধু বর্তমান খামারের (Current Tenant) রোলগুলোই তুলে আনবে!
        return await _context.Roles
            .Select(r => new RoleDto(r.Id, r.Name))
            .ToListAsync(cancellationToken);
    }
}
