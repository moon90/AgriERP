using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Livestock.Application;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Infrastructure;
using AgriERP.Modules.Livestock.Presentation.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// 1. Controllers এবং Swagger যুক্ত করা
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// 2. Building Blocks (TenantProvider, HttpContextAccessor) রেজিস্টার করা
builder.Services.AddBuildingBlocksInfrastructure();

// 3. Application Layer (MediatR) রেজিস্টার করা
builder.Services.AddLivestockApplication();

// 4. Infrastructure Layer (Database Connection) রেজিস্টার করা
builder.Services.AddDbContext<LivestockDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ILivestockDbContext কে ইন্টারফেস হিসেবে ম্যাপ করা
builder.Services.AddScoped<ILivestockDbContext>(provider => provider.GetRequiredService<LivestockDbContext>());

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "AgriERP - Livestock API v1");
    });
}

app.UseExceptionHandler();

app.UseHttpsRedirection();
app.UseRouting();

// app.UseAuthentication();
app.UseAuthorization();

// আমাদের মডিউলের কন্ট্রোলার এন্ডপয়েন্টগুলো ম্যাপ করা
app.MapControllers();

app.Run();
