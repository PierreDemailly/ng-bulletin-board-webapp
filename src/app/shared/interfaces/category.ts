import { Topic } from './topic';

/**
 * Represents a Category of topics.
 */
export interface Category {
  /**
   * Category's id
   */
  id?: number;
  /**
   * Category's name
   */
  name: string;
  /**
   * Category's description
   */
  description: string;
  /**
   * Category's replies count
   */
  repliesCount: number;
  /**
   * Category's topics count
   */
  topicsCount: number;
  /**
   * Category's topics
   */
  topics: Topic[];
  /**
   * Category's children
   */
  children?: Category[];
  /**
   * Category's parent
   */
  parent?: Category;
}
