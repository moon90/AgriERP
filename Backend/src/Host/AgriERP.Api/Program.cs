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
using AgriERP.Modules.Logistics.Application;
using AgriERP.Modules.Logistics.Infrastructure.Persistence;
using AgriERP.Modules.Logistics.Application.Common;
using AgriERP.Modules.Logistics.Presentation.Controllers;
using AgriERP.Modules.Trading.Application;
using AgriERP.Modules.Trading.Infrastructure.Persistence;
using AgriERP.Modules.Trading.Application.Common;
using AgriERP.Modules.Trading.Presentation.Controllers;
using AgriERP.Modules.Land.Application;
using AgriERP.Modules.Land.Infrastructure.Persistence;
using AgriERP.Modules.Land.Application.Common;
using AgriERP.Modules.Land.Presentation.Controllers;
using AgriERP.Modules.Irrigation.Application;
using AgriERP.Modules.Irrigation.Infrastructure.Persistence;
using AgriERP.Modules.Irrigation.Application.Common;
using AgriERP.Modules.Irrigation.Presentation.Controllers;
using AgriERP.Modules.Chemicals.Application;
using AgriERP.Modules.Chemicals.Infrastructure.Persistence;
using AgriERP.Modules.Chemicals.Application.Common;
using AgriERP.Modules.Chemicals.Presentation.Controllers;
using AgriERP.Modules.Agronomy.Application;
using AgriERP.Modules.Agronomy.Infrastructure.Persistence;
using AgriERP.Modules.Agronomy.Application.Common;
using AgriERP.Modules.Agronomy.Presentation.Controllers;
using AgriERP.Modules.Weather.Application;
using AgriERP.Modules.Weather.Infrastructure.Persistence;
using AgriERP.Modules.Weather.Application.Common;
using AgriERP.Modules.Weather.Presentation.Controllers;
using AgriERP.Modules.Insurance.Application;
using AgriERP.Modules.Insurance.Infrastructure.Persistence;
using AgriERP.Modules.Insurance.Application.Common;
using AgriERP.Modules.Insurance.Presentation.Controllers;
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
    .AddApplicationPart(typeof(LogisticsController).Assembly)
    .AddApplicationPart(typeof(TradingController).Assembly)
    .AddApplicationPart(typeof(LandLeaseController).Assembly)
    .AddApplicationPart(typeof(IrrigationController).Assembly)
    .AddApplicationPart(typeof(ChemicalsController).Assembly)
    .AddApplicationPart(typeof(AgronomyController).Assembly)
    .AddApplicationPart(typeof(WeatherController).Assembly)
    .AddApplicationPart(typeof(InsuranceController).Assembly)
    .AddApplicationPart(typeof(Program).Assembly);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

// Response Caching & Memory Caching
builder.Services.AddMemoryCache();
builder.Services.AddResponseCaching();

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
builder.Services.AddLogisticsApplication();
builder.Services.AddTradingApplication();
builder.Services.AddLandApplication();
builder.Services.AddIrrigationApplication();
builder.Services.AddChemicalsApplication();
builder.Services.AddAgronomyApplication();
builder.Services.AddWeatherApplication();
builder.Services.AddInsuranceApplication();

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
builder.Services.AddDbContext<LogisticsDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<TradingDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<LandDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<IrrigationDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ChemicalsDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<AgronomyDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<WeatherDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<InsuranceDbContext>(options => options.UseSqlServer(connectionString));

// Map db context interfaces
builder.Services.AddScoped<IAuthDbContext>(provider => provider.GetRequiredService<AuthDbContext>());
builder.Services.AddScoped<ILivestockDbContext>(provider => provider.GetRequiredService<LivestockDbContext>());
builder.Services.AddScoped<IFinanceDbContext>(provider => provider.GetRequiredService<FinanceDbContext>());
builder.Services.AddScoped<ITelemetryDbContext>(provider => provider.GetRequiredService<TelemetryDbContext>());
builder.Services.AddScoped<IHrDbContext>(provider => provider.GetRequiredService<HrDbContext>());
builder.Services.AddScoped<IAssetsDbContext>(provider => provider.GetRequiredService<AssetsDbContext>());
builder.Services.AddScoped<ICropsDbContext>(provider => provider.GetRequiredService<CropsDbContext>());
builder.Services.AddScoped<ILogisticsDbContext>(provider => provider.GetRequiredService<LogisticsDbContext>());
builder.Services.AddScoped<ITradingDbContext>(provider => provider.GetRequiredService<TradingDbContext>());
builder.Services.AddScoped<ILandDbContext>(provider => provider.GetRequiredService<LandDbContext>());
builder.Services.AddScoped<IIrrigationDbContext>(provider => provider.GetRequiredService<IrrigationDbContext>());
builder.Services.AddScoped<IChemicalsDbContext>(provider => provider.GetRequiredService<ChemicalsDbContext>());
builder.Services.AddScoped<IAgronomyDbContext>(provider => provider.GetRequiredService<AgronomyDbContext>());
builder.Services.AddScoped<IWeatherDbContext>(provider => provider.GetRequiredService<WeatherDbContext>());
builder.Services.AddScoped<IInsuranceDbContext>(provider => provider.GetRequiredService<InsuranceDbContext>());

// Cross-context lookup services
builder.Services.AddScoped<AgriERP.BuildingBlocks.Application.ICropFieldLookupService, AgriERP.Modules.Crops.Infrastructure.Services.CropFieldLookupService>();

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

builder.Services.AddEnterpriseRateLimiting();

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

app.UseMiddleware<AgriERP.Api.Infrastructure.SecurityHeadersMiddleware>();
app.UseMiddleware<AgriERP.Api.Infrastructure.IdempotencyMiddleware>();
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("Angular");
app.UseResponseCaching();
app.UseRateLimiter();

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
        var logisticsDb = services.GetRequiredService<LogisticsDbContext>();
        var tradingDb = services.GetRequiredService<TradingDbContext>();
        var landDb = services.GetRequiredService<LandDbContext>();
        var irrigationDb = services.GetRequiredService<IrrigationDbContext>();
        var hrDb = services.GetRequiredService<HrDbContext>();
        var chemicalsDb = services.GetRequiredService<ChemicalsDbContext>();
        var agronomyDb = services.GetRequiredService<AgronomyDbContext>();
        var weatherDb = services.GetRequiredService<WeatherDbContext>();
        var insuranceDb = services.GetRequiredService<InsuranceDbContext>();

        await authDb.Database.MigrateAsync();
        await hrDb.Database.MigrateAsync();
        await inventoryDb.Database.MigrateAsync();
        await livestockDb.Database.MigrateAsync();
        await financeDb.Database.MigrateAsync();
        await assetsDb.Database.MigrateAsync();
        await cropsDb.Database.MigrateAsync();
        await logisticsDb.Database.MigrateAsync();
        await tradingDb.Database.MigrateAsync();
        await landDb.Database.MigrateAsync();
        await irrigationDb.Database.MigrateAsync();
        await chemicalsDb.Database.MigrateAsync();
        await agronomyDb.Database.MigrateAsync();
        await weatherDb.Database.MigrateAsync();
        await insuranceDb.Database.MigrateAsync();

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
