/**
 * Represents survey result.
 */
export interface FormatedSurveyResult {
  /**
   * Result.
   */
  result: {
    /**
     * Answer's id.
     */
    id: number;
    /**
     * Users ids that vote the answer.
     */
    usersId: number[];
    /**
     * Count of vote for the answer.
     */
    count: number;
  }[];
  /**
   * Total count vote.
   */
  count: number;
}
