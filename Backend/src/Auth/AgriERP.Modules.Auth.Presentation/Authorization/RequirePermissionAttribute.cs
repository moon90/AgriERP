using Microsoft.AspNetCore.Mvc;

namespace AgriERP.Modules.Auth.Presentation.Authorization
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class RequirePermissionAttribute : TypeFilterAttribute
    {
        public RequirePermissionAttribute(string permission)
            : base(typeof(PermissionFilter)) // এটি একটি কাস্টম ফিল্টারকে কল করবে
        {
            Arguments = new object[] { permission };
        }
    }
}
