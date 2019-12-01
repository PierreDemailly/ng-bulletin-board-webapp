import { Topic } from './topic';
import { User } from './user';

/**
 * Represents a reply.
 */
export interface Reply {
  /**
   * Reply id.
   */
  id?: number;
  /**
   * Reply content.
   */
  content: string;
  /**
   * Reply created date.
   */
  created_at?: string;
  /**
   * Reply user.
   */
  user?: User;
  /**
   * Reply topic.
   */
  topic?: Topic;
}
