using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.BuildingBlocks.Domain
{
    public abstract class Entity
    {
        public Guid Id { get; protected set; }

        protected Entity()
        {
            // EF Core এর জন্য ফাঁকা কন্সট্রাক্টর
        }

        protected Entity(Guid id)
        {
            Id = id;
        }

        // Equality Override for Enterprise Best Practice
        public override bool Equals(object? obj)
        {
            if (obj is not Entity other)
                return false;

            if (ReferenceEquals(this, other))
                return true;

            if (Id == Guid.Empty || other.Id == Guid.Empty)
                return false;

            return Id == other.Id;
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}
