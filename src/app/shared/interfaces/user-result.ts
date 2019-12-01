import { User } from '@interfaces/user';

/**
 * Represents users result from database.
 */
export interface UserResult {
  /**
   * The users.
   */
  users: User[];
  /**
   * Total count of users?
   */
  count: number;
}
