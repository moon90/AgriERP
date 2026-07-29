using System.Collections.Generic;
using System.Linq;

namespace AgriERP.BuildingBlocks.Application.Common
{
    public static class QueryableExtensions
    {
        public static PagedResult<T> ToPagedResult<T>(
            this IEnumerable<T> source,
            int pageNumber,
            int pageSize)
        {
            var page = pageNumber < 1 ? 1 : pageNumber;
            var size = pageSize < 1 ? 10 : (pageSize > 100 ? 100 : pageSize);

            var count = source.Count();
            var items = source
                .Skip((page - 1) * size)
                .Take(size)
                .ToList();

            return new PagedResult<T>(items, count, page, size);
        }
    }
}
