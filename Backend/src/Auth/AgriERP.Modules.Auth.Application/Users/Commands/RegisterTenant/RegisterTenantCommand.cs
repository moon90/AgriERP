using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application.Users.Commands.RegisterTenant
{
    // এটি নতুন কোম্পানির রেজিস্ট্রেশন ডেটা বহন করবে
    public record RegisterTenantCommand(
        string CompanyName,
        string Email,
        string Password,
        string FullName) : IRequest<Guid>; // এটি তৈরি হওয়া নতুন Tenant-এর Id রিটার্ন করবে
}
