using AgriERP.Api.Infrastructure;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Auth.Application;
using AgriERP.Modules.Auth.Application.Common.Interfaces;
using AgriERP.Modules.Auth.Infrastructure;
using AgriERP.Modules.Auth.Infrastructure.Persistence;
using AgriERP.Modules.Auth.Infrastructure.Seeding;
using AgriERP.Modules.Auth.Presentation.Controllers;
using AgriERP.Modules.Inventory.Application;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using AgriERP.Modules.Inventory.Presentation.Controllers;
using AgriERP.Modules.Livestock.Application;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Infrastructure.Persistence;
using AgriERP.Modules.Livestock.Presentation.Controllers;
using AgriERP.Modules.Finance.Application;
using AgriERP.Modules.Finance.Infrastructure.Persistence;
using AgriERP.Modules.Finance.Presentation.Controllers;
using AgriERP.Modules.Finance.Application.Common;
using AgriERP.Modules.Telemetry.Application;
using AgriERP.Modules.Telemetry.Application.Common;
using AgriERP.Modules.Telemetry.Infrastructure.Persistence;
using AgriERP.Modules.Telemetry.Presentation.Controllers;
using AgriERP.Modules.HR.Application;
using AgriERP.Modules.HR.Application.Common;
using AgriERP.Modules.HR.Infrastructure.Persistence;
using AgriERP.Modules.HR.Presentation.Controllers;
using AgriERP.Modules.Assets.Application;
using AgriERP.Modules.Assets.Infrastructure.Persistence;
using AgriERP.Modules.Assets.Application.Common;
using AgriERP.Modules.Assets.Presentation.Controllers;
using AgriERP.Modules.Crops.Application;
using AgriERP.Modules.Crops.Infrastructure.Persistence;
using AgriERP.Modules.Crops.Application.Common;
using AgriERP.Modules.Crops.Presentation.Controllers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// 1. Controllers registration from all modules
builder.Services.AddControllers()
    .AddApplicationPart(typeof(AnimalsController).Assembly)
    .AddApplicationPart(typeof(StocksController).Assembly)
    .AddApplicationPart(typeof(AuthController).Assembly)
    .AddApplicationPart(typeof(LedgerController).Assembly)
    .AddApplicationPart(typeof(TelemetryController).Assembly)
    .AddApplicationPart(typeof(EmployeesController).Assembly)
    .AddApplicationPart(typeof(AssetsController).Assembly)
    .AddApplicationPart(typeof(CropsController).Assembly)
    .AddApplicationPart(typeof(Program).Assembly);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

// 2. Distributed Caching support for Permission Caching
builder.Services.AddDistributedMemoryCache();

// 3. Shared/Building Blocks (TenantProvider, HttpContextAccessor)
builder.Services.AddBuildingBlocksInfrastructure();

// 4. Auth Services
builder.Services.AddAuthInfrastructure();

// 5. MediatR / Application Layers per module
builder.Services.AddLivestockApplication();
builder.Services.AddInventoryApplication();
builder.Services.AddAuthApplication();
builder.Services.AddFinanceApplication();
builder.Services.AddTelemetryApplication();
builder.Services.AddHrApplication();
builder.Services.AddAssetsApplication();
builder.Services.AddCropsApplication();

// 6. DB Context setup for SQL Server
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<LivestockDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<InventoryDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<AuthDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<FinanceDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<TelemetryDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<HrDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<AssetsDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<CropsDbContext>(options => options.UseSqlServer(connectionString));

// Map db context interfaces
builder.Services.AddScoped<IAuthDbContext>(provider => provider.GetRequiredService<AuthDbContext>());
builder.Services.AddScoped<ILivestockDbContext>(provider => provider.GetRequiredService<LivestockDbContext>());
builder.Services.AddScoped<IFinanceDbContext>(provider => provider.GetRequiredService<FinanceDbContext>());
builder.Services.AddScoped<ITelemetryDbContext>(provider => provider.GetRequiredService<TelemetryDbContext>());
builder.Services.AddScoped<IHrDbContext>(provider => provider.GetRequiredService<HrDbContext>());
builder.Services.AddScoped<IAssetsDbContext>(provider => provider.GetRequiredService<AssetsDbContext>());
builder.Services.AddScoped<ICropsDbContext>(provider => provider.GetRequiredService<CropsDbContext>());

// Register test event handler for integration verification
builder.Services.AddScoped<INotificationHandler<AgriERP.BuildingBlocks.Application.Events.StockValueConsumedIntegrationEvent>, AgriERP.Api.Controllers.TestStockValueConsumedIntegrationEventHandler>();

// Exception handling
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT Security setup
var jwtSecret = builder.Configuration["JwtSettings:Secret"];
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"];
var jwtAudience = builder.Configuration["JwtSettings:Audience"];

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret!))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// HTTP request pipeline configuration
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "AgriERP - Core API v1");
    });
}

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("Angular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Database Migrations & Seeding on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        // 1. Automatically Apply SQL Server Migrations for all modules
        var authDb = services.GetRequiredService<AuthDbContext>();
        var inventoryDb = services.GetRequiredService<InventoryDbContext>();
        var livestockDb = services.GetRequiredService<LivestockDbContext>();
        var financeDb = services.GetRequiredService<FinanceDbContext>();
        var assetsDb = services.GetRequiredService<AssetsDbContext>();
        var cropsDb = services.GetRequiredService<CropsDbContext>();

        await authDb.Database.MigrateAsync();
        await inventoryDb.Database.MigrateAsync();
        await livestockDb.Database.MigrateAsync();
        await financeDb.Database.MigrateAsync();
        await assetsDb.Database.MigrateAsync();
        await cropsDb.Database.MigrateAsync();

        // 2. Seeder call
        var authSeeder = services.GetRequiredService<IAuthDbSeeder>();
        await authSeeder.SeedAsync();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("Program");
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}

app.Run();
