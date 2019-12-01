/**
 * Represents filter of topics table.
 */
export interface TopicsTablePaginationFilter {
  /**
   * Topics category's id.
   */
  categoryId: number;
  /**
   * Topics page.
   */
  page: number;
  /**
   * Topics limit.
   */
  limit: number;
}
