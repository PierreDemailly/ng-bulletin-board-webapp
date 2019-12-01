import { Topic } from './topic';
import { User } from './user';

/**
 * Represents a post.
 *
 * A post is a Topic OR a Reply.
 */
export interface Post {
  /**
   * Post's id.
   */
  id?: number;
  /**
   * Post's content.
   */
  content: string;
  /**
   * Post's created date.
   */
  created_at?: string;
  /**
   * Post's author.
   */
  user?: User;
  /**
   * Post's topic.
   *
   * In case the post is a Reply.
   */
  topic?: Topic;
  /**
   * Post's title.
   *
   * In case the post is a Topic.
   */
  title?: string;
}
