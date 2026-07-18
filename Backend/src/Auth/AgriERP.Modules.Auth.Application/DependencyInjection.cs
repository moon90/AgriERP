using AgriERP.BuildingBlocks.Application.Behaviors;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddAuthApplication(this IServiceCollection services)
        {
            var assembly = typeof(DependencyInjection).Assembly;

            // MediatR রেজিস্টার করা এবং Inventory অ্যাসেম্বলির সব Command/Query স্ক্যান করা
            services.AddMediatR(config =>
            {
                config.RegisterServicesFromAssembly(assembly);

                // Inventory-এর মতো এখানেও Pipeline Behavior যুক্ত করতে চাইলে এটি আনকমেন্ট করে নিতে পারেন
                config.AddOpenBehavior(typeof(ValidationBehavior<,>));
            });

            // FluentValidation-এর ভ্যালিডেটর স্ক্যান করা
            services.AddValidatorsFromAssembly(assembly);

            return services;
        }
    }
}
