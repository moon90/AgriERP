using AgriERP.Modules.Livestock.Application.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Animals.Commands.SlaughterAnimal
{
    public class SlaughterAnimalCommandHandler : IRequestHandler<SlaughterAnimalCommand>
    {
        private readonly ILivestockDbContext _context;

        public SlaughterAnimalCommandHandler(ILivestockDbContext context)
        {
            _context = context;
        }

        public async Task Handle(SlaughterAnimalCommand request, CancellationToken cancellationToken)
        {
            // ডেটাবেস থেকে পশুটিকে খুঁজে বের করা
            var animal = await _context.Animals.FirstOrDefaultAsync(a => a.Id == request.AnimalId, cancellationToken);

            if (animal == null)
                throw new Exception("Animal not found.");

            // ডোমেইন লজিক কল করা (এখানেই ইভেন্ট জেনারেট হবে)
            animal.ProcessForSlaughter();

            // ডেটাবেসে সেভ করা (এবং এখানেই SaveChangesAsync ইভেন্টটিকে ব্রডকাস্ট করে দেবে!)
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
