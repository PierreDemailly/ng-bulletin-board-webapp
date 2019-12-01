import { Answer } from './answer';
import { Category } from './category';
import { Reply } from './reply';
import { Survey } from './survey';
import { User } from './user';

/**
 * Represents a topic.
 */
export interface Topic {
  /**
   * Topic's id?
   */
  id?: number;
  /**
   * Topic's title.
   */
  title: string;
  /**
   * Topic's content.
   */
  content: string;
  /**
   * Topic's created date.
   */
  created_at?: string;
  /**
   * Topic's category.
   */
  category: Category;
  /**
   * Topic's author.
   */
  user?: User;
  /**
   * Topic's replies.
   */
  replies?: Reply[];
  /**
   * Topic's survey.
   */
  survey?: Survey;
  /**
   * Contains all answers of the survey.
   */
  surveyAnswers?: SurveyAnswer[];
}

/**
 * Represents survey answer (a vote for an answer).
 */
export interface SurveyAnswer {
  /**
   * Survey answer id.
   */
  id: number;
  /**
   * Survey answer answer.
   */
  answer: Answer;
  /**
   * Survey answer user.
   */
  user: User;
}
