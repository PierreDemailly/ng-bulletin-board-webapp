import { Reply } from './reply';
import { Topic } from './topic';

/**
 * Represents a user.
 */
export interface User {
  /**
   * User's id.
   */
  id?: number;
  /**
   * User's email.
   */
  email: string;
  /**
   * User's pseudo.
   */
  pseudo: string;
  /**
   * User's password.
   */
  password?: string;
  /**
   * User's rank.
   */
  rank: number;
  /**
   * User's signature.
   */
  signature?: string;
  /**
   * User's avatar (file name, not file itself).
   */
  avatar: string;
  /**
   * User's registration date.
   */
  createdAt?: Date;
  /**
   * User's last activity.
   */
  last_activity?: Date;
  /**
   * User's count of posts.
   */
  post_count: number;
  /**
   * User's list of blacklisted users.
   */
  blacklist?: User[];
  /**
   * User's blacklisted users ids.
   */
  blacklistIds?: number[];
  /**
   * User's last modification date.
   */
  updatedAt?: Date;
  /**
   * User's topics.
   */
  topics?: Topic[];
  /**
   * User's replies.
   */
  replies?: Reply[];
}
