USE [AgriErpDb];
GO

-- 1. [auth].[RefreshTokens] & [auth].[OutboxMessages]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RefreshTokens' AND schema_id = SCHEMA_ID('auth'))
BEGIN
    CREATE TABLE [auth].[RefreshTokens] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [UserId] UNIQUEIDENTIFIER NOT NULL,
        [Token] NVARCHAR(256) NOT NULL UNIQUE,
        [ExpiresAt] DATETIME2 NOT NULL,
        [IsRevoked] BIT NOT NULL DEFAULT 0,
        [CreatedAt] DATETIME2 NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OutboxMessages' AND schema_id = SCHEMA_ID('auth'))
BEGIN
    CREATE TABLE [auth].[OutboxMessages] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [Type] NVARCHAR(256) NOT NULL,
        [Content] NVARCHAR(MAX) NOT NULL,
        [OccurredOn] DATETIME2 NOT NULL,
        [ProcessedOn] DATETIME2 NULL,
        [Error] NVARCHAR(MAX) NULL
    );
END
GO

-- 2. [crops].[FieldPlots] & [crops].[HarvestRecords]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'FieldPlots' AND schema_id = SCHEMA_ID('crops'))
BEGIN
    CREATE TABLE [crops].[FieldPlots] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [CropFieldId] UNIQUEIDENTIFIER NOT NULL,
        [Name] NVARCHAR(200) NOT NULL,
        [AreaAcres] FLOAT NOT NULL,
        [GpsLatitude] FLOAT NULL,
        [GpsLongitude] FLOAT NULL,
        [SoilType] NVARCHAR(100) NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'HarvestRecords' AND schema_id = SCHEMA_ID('crops'))
BEGIN
    CREATE TABLE [crops].[HarvestRecords] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [CropCycleId] UNIQUEIDENTIFIER NOT NULL,
        [HarvestDate] DATETIME2 NOT NULL,
        [YieldBushels] FLOAT NOT NULL,
        [MoisturePercent] FLOAT NOT NULL,
        [QualityGrade] NVARCHAR(50) NULL,
        [Notes] NVARCHAR(MAX) NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

-- 3. [livestock].[MilkCollections] & [livestock].[TankerBatches]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MilkCollections' AND schema_id = SCHEMA_ID('livestock'))
BEGIN
    CREATE TABLE [livestock].[MilkCollections] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [AnimalId] UNIQUEIDENTIFIER NOT NULL,
        [CollectionDate] DATETIME2 NOT NULL,
        [VolumeLiters] FLOAT NOT NULL,
        [FatPercent] FLOAT NULL,
        [ProteinPercent] FLOAT NULL,
        [CollectorName] NVARCHAR(100) NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TankerBatches' AND schema_id = SCHEMA_ID('livestock'))
BEGIN
    CREATE TABLE [livestock].[TankerBatches] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [BatchDate] DATETIME2 NOT NULL,
        [TotalVolumeLiters] FLOAT NOT NULL,
        [AvgFatPercent] FLOAT NULL,
        [AvgProteinPercent] FLOAT NULL,
        [DriverName] NVARCHAR(100) NULL,
        [TruckNumber] NVARCHAR(50) NULL,
        [DestinationDairy] NVARCHAR(200) NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

-- 4. [logistics].[Silos] & [logistics].[ScaleTransfers]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Silos' AND schema_id = SCHEMA_ID('logistics'))
BEGIN
    CREATE TABLE [logistics].[Silos] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [ElevatorId] UNIQUEIDENTIFIER NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        [CapacityBushels] FLOAT NOT NULL,
        [CurrentFillBushels] FLOAT NOT NULL,
        [CommodityType] NVARCHAR(100) NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ScaleTransfers' AND schema_id = SCHEMA_ID('logistics'))
BEGIN
    CREATE TABLE [logistics].[ScaleTransfers] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [FromSiloId] UNIQUEIDENTIFIER NULL,
        [ToSiloId] UNIQUEIDENTIFIER NULL,
        [QuantityBushels] FLOAT NOT NULL,
        [TransferDate] DATETIME2 NOT NULL,
        [CommodityType] NVARCHAR(100) NULL,
        [Notes] NVARCHAR(MAX) NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

-- 5. [trading].[DeliveryFulfillments] & [trading].[MarginCalls]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DeliveryFulfillments' AND schema_id = SCHEMA_ID('trading'))
BEGIN
    CREATE TABLE [trading].[DeliveryFulfillments] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [SalesContractId] UNIQUEIDENTIFIER NOT NULL,
        [DeliveryDate] DATETIME2 NOT NULL,
        [QuantityDelivered] FLOAT NOT NULL,
        [TruckNumber] NVARCHAR(50) NULL,
        [DriverName] NVARCHAR(100) NULL,
        [ReceiptNumber] NVARCHAR(100) NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MarginCalls' AND schema_id = SCHEMA_ID('trading'))
BEGIN
    CREATE TABLE [trading].[MarginCalls] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [HedgingPositionId] UNIQUEIDENTIFIER NOT NULL,
        [CallDate] DATETIME2 NOT NULL,
        [RequiredAmount] DECIMAL(18,2) NOT NULL,
        [IsSatisfied] BIT NOT NULL DEFAULT 0,
        [SatisfiedDate] DATETIME2 NULL,
        [Notes] NVARCHAR(MAX) NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

-- 6. [land].[Parcels] & [land].[CropShareSplits]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Parcels' AND schema_id = SCHEMA_ID('land'))
BEGIN
    CREATE TABLE [land].[Parcels] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [ParcelNumber] NVARCHAR(100) NOT NULL,
        [LegalDescription] NVARCHAR(MAX) NULL,
        [TotalAcres] FLOAT NOT NULL,
        [CountyName] NVARCHAR(100) NULL,
        [StateName] NVARCHAR(50) NULL,
        [GpsLatitude] FLOAT NULL,
        [GpsLongitude] FLOAT NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CropShareSplits' AND schema_id = SCHEMA_ID('land'))
BEGIN
    CREATE TABLE [land].[CropShareSplits] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [LandLeaseId] UNIQUEIDENTIFIER NOT NULL,
        [CropType] NVARCHAR(100) NOT NULL,
        [LandlordSharePercent] FLOAT NOT NULL,
        [TenantSharePercent] FLOAT NOT NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL
    );
END
GO

-- 7. [insurance].[Adjustments]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Adjustments' AND schema_id = SCHEMA_ID('insurance'))
BEGIN
    CREATE TABLE [insurance].[Adjustments] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [LossClaimId] UNIQUEIDENTIFIER NOT NULL,
        [AdjusterName] NVARCHAR(100) NULL,
        [AdjustmentDate] DATETIME2 NOT NULL,
        [AssessedLossAmount] DECIMAL(18,2) NOT NULL,
        [SettlementAmount] DECIMAL(18,2) NOT NULL,
        [Notes] NVARCHAR(MAX) NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL
    );
END
GO

-- 8. [chemicals].[ActiveIngredients] & [chemicals].[PHITimers]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ActiveIngredients' AND schema_id = SCHEMA_ID('chemicals'))
BEGIN
    CREATE TABLE [chemicals].[ActiveIngredients] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [ChemicalProductId] UNIQUEIDENTIFIER NOT NULL,
        [IngredientName] NVARCHAR(100) NOT NULL,
        [ConcentrationPercent] FLOAT NOT NULL,
        [EPARegistrationNumber] NVARCHAR(100) NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PHITimers' AND schema_id = SCHEMA_ID('chemicals'))
BEGIN
    CREATE TABLE [chemicals].[PHITimers] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [ApplicationLogId] UNIQUEIDENTIFIER NOT NULL,
        [CropFieldId] UNIQUEIDENTIFIER NOT NULL,
        [PHIDays] INT NOT NULL,
        [ApplicationDate] DATETIME2 NOT NULL,
        [SafeHarvestDate] DATETIME2 NOT NULL,
        [IsExpired] BIT NOT NULL DEFAULT 0,
        [TenantId] UNIQUEIDENTIFIER NOT NULL
    );
END
GO

-- 9. [weather].[GDDAccumulations]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GDDAccumulations' AND schema_id = SCHEMA_ID('weather'))
BEGIN
    CREATE TABLE [weather].[GDDAccumulations] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [CropFieldId] UNIQUEIDENTIFIER NOT NULL,
        [AccumulationDate] DATETIME2 NOT NULL,
        [BaseTempF] FLOAT NOT NULL,
        [DailyGDD] FLOAT NOT NULL,
        [CumulativeGDD] FLOAT NOT NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL
    );
END
GO

-- 10. [irrigation].[WaterPermits] & [irrigation].[PumpingLogs]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'WaterPermits' AND schema_id = SCHEMA_ID('irrigation'))
BEGIN
    CREATE TABLE [irrigation].[WaterPermits] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [WaterSourceId] UNIQUEIDENTIFIER NOT NULL,
        [PermitNumber] NVARCHAR(100) NOT NULL,
        [IssuingAuthority] NVARCHAR(150) NULL,
        [AnnualAllocationGallons] FLOAT NOT NULL,
        [ExpirationDate] DATETIME2 NULL,
        [IsActive] BIT NOT NULL DEFAULT 1,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PumpingLogs' AND schema_id = SCHEMA_ID('irrigation'))
BEGIN
    CREATE TABLE [irrigation].[PumpingLogs] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [WaterSourceId] UNIQUEIDENTIFIER NOT NULL,
        [PumpStartTime] DATETIME2 NOT NULL,
        [PumpEndTime] DATETIME2 NULL,
        [GallonsPumped] FLOAT NOT NULL,
        [EnergyKwh] FLOAT NULL,
        [Notes] NVARCHAR(MAX) NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL
    );
END
GO

-- 11. [assets].[FuelLogs] & [assets].[DepreciationSchedules]
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'FuelLogs' AND schema_id = SCHEMA_ID('assets'))
BEGIN
    CREATE TABLE [assets].[FuelLogs] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [AssetId] UNIQUEIDENTIFIER NOT NULL,
        [FuelDate] DATETIME2 NOT NULL,
        [FuelType] NVARCHAR(50) NOT NULL DEFAULT 'Diesel',
        [GallonsFilled] FLOAT NOT NULL,
        [OdometerReading] FLOAT NULL,
        [CostPerGallon] DECIMAL(18,2) NOT NULL,
        [TotalCost] DECIMAL(18,2) NOT NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL,
        [CreatedBy] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy] NVARCHAR(100) NULL,
        [UpdatedAt] DATETIME2 NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DepreciationSchedules' AND schema_id = SCHEMA_ID('assets'))
BEGIN
    CREATE TABLE [assets].[DepreciationSchedules] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        [AssetId] UNIQUEIDENTIFIER NOT NULL,
        [Method] NVARCHAR(50) NOT NULL DEFAULT 'StraightLine',
        [UsefulLifeYears] INT NOT NULL,
        [SalvageValue] DECIMAL(18,2) NOT NULL,
        [DepreciationPerYear] DECIMAL(18,2) NOT NULL,
        [AccumulatedDepreciation] DECIMAL(18,2) NOT NULL,
        [TenantId] UNIQUEIDENTIFIER NOT NULL
    );
END
GO
