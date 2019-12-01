import { Survey } from './survey';

/**
 * Represents new topic form.
 */
export interface NewTopicForm {
  /**
   * Title of topic.
   */
  title: string;
  /**
   * Content of topic.
   */
  content: string;
  /**
   * Survey of topic.
   */
  survey: Survey;
}
