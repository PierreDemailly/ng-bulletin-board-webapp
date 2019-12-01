/**
 * Represents topics filter.
 */
export interface TopicsFilter {
  /**
   * Whether get "TOP" topics with most answers or latests ones.
   */
  filter: 'top' | 'latest';
  /**
   * Topics page.
   */
  page: number;
  /**
   * Topics limit.
   */
  limit: number;
}
