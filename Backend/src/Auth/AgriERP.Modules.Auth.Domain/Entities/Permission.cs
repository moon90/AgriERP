using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Domain.Entities
{
    public class Permission
    {
        public string Code { get; private set; } // e.g., "Animal.Create", "Inventory.View"
        public string Name { get; private set; } // e.g., "Create Animal"
        public string Module { get; private set; } // e.g., "Livestock", "Inventory"

        protected Permission() 
        {
            Code = null!;
            Name = null!;
            Module = null!;
        }

        public Permission(string code, string name, string module)
        {
            Code = code;
            Name = name;
            Module = module;
        }
    }
}
