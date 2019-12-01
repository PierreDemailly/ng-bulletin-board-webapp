/**
 * Represents mat-paginator event.
 */
export interface MatPaginationChangeEvent {
  /**
   * Paginator previous page index.
   */
  previousPageIndex: number;
  /**
   * Paginator current page index.
   */
  pageIndex: number;
  /**
   * Paginator page size.
   */
  pageSize: number;
  /**
   * Paginator length (total count).
   */
  length: number;
}
