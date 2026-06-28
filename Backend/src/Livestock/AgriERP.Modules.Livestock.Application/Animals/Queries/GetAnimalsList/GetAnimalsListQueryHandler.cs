using AgriERP.BuildingBlocks.Application;
using MediatR;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Dapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Animals.Queries.GetAnimalsList
{
    public class GetAnimalsListQueryHandler : IRequestHandler<GetAnimalsListQuery, IEnumerable<AnimalDto>>
    {
        private readonly string _connectionString;
        private readonly ITenantProvider _tenantProvider;

        public GetAnimalsListQueryHandler(IConfiguration configuration, ITenantProvider tenantProvider)
        {
            _tenantProvider = tenantProvider;
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<IEnumerable<AnimalDto>> Handle(GetAnimalsListQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Tenant ID is missing. Access denied.");
            }

            // Dapper এর জন্য পিওর নপজিস্কুল (Npgsql) কানেকশন তৈরি
            using var connection = new NpgsqlConnection(_connectionString);

            // Raw SQL Query: শুধুমাত্র কারেন্ট ট্যানেন্টের ডেটা তুলে আনা হবে
            // আমরা এনাম (Enum) গুলোকে ইন্টারনেটে সহজে পড়ার জন্য টেক্সট হিসেবে কাস্ট করব না, 
            // ডাটাবেসের ইন্ট ভ্যালুগুলোকে Dapper অটোম্যাটিক এনাম স্ট্রিংয়ে ম্যাপ করতে পারে (যদি DTO তে স্ট্রিং থাকে)।
            const string sql = @"
            SELECT 
                id AS Id, 
                tag_number AS TagNumber, 
                species AS Species, 
                purpose AS Purpose, 
                status AS Status, 
                current_weight AS CurrentWeight, 
                date_of_birth AS DateOfBirth
            FROM livestock.""Animals""
            WHERE tenant_id = @TenantId;";

            // ডিবিতে কোয়েরি এক্সিকিউট করা এবং সরাসরি DTO তে ম্যাপ করা
            var animals = await connection.QueryAsync<AnimalDto>(sql, new { TenantId = tenantId });

            return animals;
        }
    }
}
