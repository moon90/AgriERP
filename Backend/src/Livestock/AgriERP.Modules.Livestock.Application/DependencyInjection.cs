using AgriERP.BuildingBlocks.Application.Behaviors;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddLivestockApplication(this IServiceCollection services)
        {
            var assembly = typeof(DependencyInjection).Assembly;

            // ১. MediatR এবং Pipeline Behavior রেজিস্টার করা

            // MediatR কে এই প্রজেক্টের (Assembly) সবগুলো Command/Query স্ক্যান করার নির্দেশ দেওয়া হলো
            services.AddMediatR(config =>
            {
                config.RegisterServicesFromAssembly(assembly);
                config.AddOpenBehavior(typeof(ValidationBehavior<,>)); // Pipeline যুক্ত করা হলো
            });

            // ২. FluentValidation এর সবগুলো ভ্যালিডেটর স্ক্যান করে রেজিস্টার করা
            services.AddValidatorsFromAssembly(assembly);

            return services;
        }
    }
}
