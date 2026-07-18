using AgriERP.BuildingBlocks.Domain;
using NetArchTest.Rules;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Architecture.Tests
{
    public class DomainLayerTests
    {
        [Fact]
        public void DomainLayer_ShouldNotHave_DependencyOnEntityFramework()
        {
            // Arrange
            var domainAssembly = typeof(Entity).Assembly; // ডোমেইন প্রজেক্টের রেফারেন্স

            // Act
            var result = Types.InAssembly(domainAssembly)
                .ShouldNot()
                .HaveDependencyOn("Microsoft.EntityFrameworkCore")
                .GetResult();

            // Assert
            Assert.True(result.IsSuccessful, "Architecture Violation: Domain layer must not depend on Entity Framework Core!");
        }
    }
}
