namespace AgriERP.BuildingBlocks.Application.Common
{
    public class PaginationQuery
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
        public string? SortBy { get; set; }
        public string SortOrder { get; set; } = "asc"; // "asc" or "desc"
    }
}
