using AgriERP.Modules.Livestock.Application.Animals.Commands.RegisterAnimal;
using AgriERP.Modules.Livestock.Application.Animals.Queries.GetAnimalsList;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AgriERP.Modules.Livestock.Presentation.Controllers
{
    [ApiController]
    [Route("api/v1/livestock/[controller]")]
    public class AnimalsController : ControllerBase
    {
        private readonly ISender _sender; // MediatR এর ইন্টারফেস

        public AnimalsController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterAnimal([FromBody] RegisterAnimalCommand command, CancellationToken cancellationToken)
        {
            // API সরাসরি ডেটাবেস সেভ করবে না, সে শুধু Command টি MediatR এর কাছে পাঠিয়ে দেবে
            var animalId = await _sender.Send(command, cancellationToken);

            // সফলভাবে সেভ হলে 201 Created স্ট্যাটাস এবং নতুন পশুর ID রিটার্ন করবে
            return Created($"/api/v1/livestock/animals/{animalId}", new { Id = animalId });
        }

        [HttpGet]
        public async Task<IActionResult> GetAnimals(CancellationToken cancellationToken)
        {
            var query = new GetAnimalsListQuery();
            var result = await _sender.Send(query, cancellationToken);

            return Ok(result);
        }
    }
}
