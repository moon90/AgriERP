using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Auth.Domain.Entities;
using AgriERP.Modules.Auth.Presentation.Controllers;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Security.Claims;
using Xunit;

namespace AgriERP.Architecture.Tests;

public class MultiTenantIsolationTests
{
    [Fact]
    public void Tenant_Entity_Initializes_Active_With_Subdomain()
    {
        // Arrange & Act
        var tenant = new Tenant("Highland Grain Estate", "highlandgrain");

        // Assert
        Assert.NotEqual(Guid.Empty, tenant.Id);
        Assert.Equal("Highland Grain Estate", tenant.Name);
        Assert.Equal("highlandgrain", tenant.Subdomain);
        Assert.True(tenant.IsActive);
    }

    [Fact]
    public void Tenant_Deactivate_Marks_Inactive()
    {
        // Arrange
        var tenant = new Tenant("Sunrise Cattle Ltd");

        // Act
        tenant.Deactivate();

        // Assert
        Assert.False(tenant.IsActive);
    }

    [Fact]
    public void HttpTenantProvider_Resolves_Tenant_From_Jwt_Claims()
    {
        // Arrange
        var tenantId = Guid.NewGuid();
        var httpContext = new DefaultHttpContext();
        var claims = new[]
        {
            new Claim("tenant_id", tenantId.ToString()),
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        httpContext.User = new ClaimsPrincipal(identity);

        var mockAccessor = new Mock<IHttpContextAccessor>();
        mockAccessor.Setup(a => a.HttpContext).Returns(httpContext);

        var provider = new HttpTenantProvider(mockAccessor.Object);

        // Act & Assert
        Assert.True(provider.IsTenantAvailable);
        Assert.Equal(tenantId, provider.TenantId);
    }

    [Fact]
    public void HttpTenantProvider_Fallback_To_X_Tenant_Id_Header()
    {
        // Arrange
        var tenantId = Guid.NewGuid();
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Headers["X-Tenant-Id"] = tenantId.ToString();

        var mockAccessor = new Mock<IHttpContextAccessor>();
        mockAccessor.Setup(a => a.HttpContext).Returns(httpContext);

        var provider = new HttpTenantProvider(mockAccessor.Object);

        // Act & Assert
        Assert.True(provider.IsTenantAvailable);
        Assert.Equal(tenantId, provider.TenantId);
    }

    [Fact]
    public void SwitchTenantRequest_Initializes_Correctly()
    {
        // Arrange
        var newTenantId = Guid.NewGuid();
        var request = new SwitchTenantRequest(newTenantId);

        // Assert
        Assert.Equal(newTenantId, request.TenantId);
    }
}
