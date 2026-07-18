using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Animals.Commands.RegisterAnimal
{
    public class RegisterAnimalCommandHandler : IRequestHandler<RegisterAnimalCommand, Guid>
    {
        private readonly ILivestockDbContext _dbContext;
        private readonly ITenantProvider _tenantProvider;

        // Dependency Injection এর মাধ্যমে ডেটাবেস এবং ট্যানেন্ট প্রোভাইডার নিয়ে আসছি
        public RegisterAnimalCommandHandler(ILivestockDbContext dbContext, ITenantProvider tenantProvider)
        {
            _dbContext = dbContext;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(RegisterAnimalCommand request, CancellationToken cancellationToken)
        {
            // ১. কারেন্ট ট্যানেন্ট (কোম্পানি) আইডি বের করা
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Tenant ID is missing. Cannot register animal.");
            }

            // ২. ডোমেইন ক্লাসের Factory Method কল করে নতুন Animal তৈরি করা
            var newAnimal = Animal.Register(
                tenantId: tenantId,
                tagNumber: request.TagNumber,
                species: request.Species,
                purpose: request.Purpose,
                dob: request.DateOfBirth,
                initialWeight: request.InitialWeight
            );

            // ৩. ডেটাবেসে অ্যাড করা (EF Core Change Tracker)
            _dbContext.Animals.Add(newAnimal);

            // ৪. ডেটাবেসে সেভ করা (এই মুহূর্তে Base DbContext অটোমেটিকভাবে ট্যানেন্ট ভ্যালিডেশন করবে)
            await _dbContext.SaveChangesAsync(cancellationToken);

            // ৫. নতুন তৈরি হওয়া পশুর ID রিটার্ন করা
            return newAnimal.Id;
        }
    }
}
