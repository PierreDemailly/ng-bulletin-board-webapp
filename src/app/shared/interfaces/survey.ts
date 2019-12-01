import { Answer } from './answer';

/**
 * Represents a topic survey.
 */
export interface Survey {
  /**
   * Survey's title.
   */
  title: string;
  /**
   * Survey's answers.
   */
  answers: Answer[];
}
