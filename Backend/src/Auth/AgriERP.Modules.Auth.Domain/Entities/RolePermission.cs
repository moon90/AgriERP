using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Domain.Entities
{
    public class RolePermission
    {
        public Guid RoleId { get; private set; }
        public string PermissionCode { get; private set; }

        protected RolePermission() 
        {
            PermissionCode = null!;
        }

        public RolePermission(Guid roleId, string permissionCode)
        {
            RoleId = roleId;
            PermissionCode = permissionCode;
        }
    }
}
