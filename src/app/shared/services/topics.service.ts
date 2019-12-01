import { Injectable } from '@angular/core';

import { Answer } from '@interfaces/answer';
import { FormatedSurveyResult } from '@interfaces/formated-survey-result';
import { Survey } from '@interfaces/survey';
import { Topic } from '@interfaces/topic';
import { User } from '@interfaces/user';
import { ApiService } from '@services/api.service';

/**
 * Topics service of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class TopicsService {
  /**
   * Creates an instance of TopicsService.
   */
  constructor(private apiService: ApiService) { }

  /**
   * Get all topics in a category filtered from page/limit.
   */
  getAll(
    categoryId: number,
    filter: 'latest' | 'top' = 'latest',
    page: number,
    limit: number,
  ): Promise<{ topics: Topic[], count: number }> {
    return this.apiService.get(
      `/topics/category/${categoryId}?filter=${filter}&page=${page}&limit=${limit}`,
    );
  }

  /**
   * Find a topic from his id.
   */
  find(topicId: number): Promise<Topic> {
    return this.apiService.get('/topics/' + topicId);
  }

  /**
   * Add a topic.
   */
  add(topic: Topic): Promise<Topic> {
    return this.apiService.post('/topics', topic);
  }

  /**
   * Edit a topic.
   */
  edit(topic: Topic): Promise<void> {
    return this.apiService.put('/topics', topic);
  }

  /**
   * Vote topic's survey.
   */
  voteSurvey(survey: Survey, answer: Answer, user: User) {
    return this.apiService.post('/topics/survey', {
      survey, answer, user,
    });
  }

  /**
   * Format survey results before displaying them.
   */
  formatSurveyResult(topic: Topic): FormatedSurveyResult {
    const surveyToFormat = topic.surveyAnswers;
    const formated: FormatedSurveyResult = {
      result: [],
      count: null,
    };

    for (let i = 0; i < surveyToFormat.length; i++) {
      const survey = surveyToFormat[i];
      const index = formated.result.findIndex((element) => {
        return element.id === survey.answer.id;
      });

      if (index === -1) {
        formated.result.push({
          id: survey.answer.id,
          usersId: [survey.user.id],
          count: 1,
        });
      } else {
        formated.result[index].usersId.push(survey.user.id);
        formated.result[index].count += 1;
      }

      formated.count = formated.count + 1;
    }

    return formated;
  }
}
