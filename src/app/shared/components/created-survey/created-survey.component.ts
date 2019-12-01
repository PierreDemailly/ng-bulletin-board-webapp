import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Answer } from '@interfaces/answer';
import { FormatedSurveyResult } from '@interfaces/formated-survey-result';
import { Topic } from '@interfaces/topic';
import { User } from '@interfaces/user';
import { TopicsService } from '@services/topics.service';
import { UserService } from '@services/user.service';

/**
 * Created survey component.
 *
 * Display survey with possibilty to see results or vote answer.
 */
@Component({
  selector: 'app-created-survey',
  templateUrl: './created-survey.component.html',
  styleUrls: ['./created-survey.component.scss'],
})
export class CreatedSurveyComponent {
  /**
   * Survey's result.
   */
  result: FormatedSurveyResult;
  /**
   * Whether current user already voted.
   */
  userHasVoted = false;
  /**
   * Current user.
   */
  user: User;
  /**
   * Whether displaying result or survey.
   */
  displaying: 'vote' | 'result' = 'vote';
  /**
   * Survey's topic.
   */
  private _topic: Topic;
  /**
   * Survey's topic @Input with setter.
   */
  @Input('topic')
  set topic(topic: Topic) {
    if (topic) {
      this._topic = topic;
      this.initialize();
    }
  }
  /**
   * Survey's topic getter.
   */
  get topic(): Topic {
    return this._topic;
  }
  /**
   * Whether user is allowed to vote.
   */
  @Input() voteAllowed = false;
  /**
   * Event sent when user answer the survey.
   */
  @Output() answer = new EventEmitter<Answer>();

  /**
   * Creates an instance of CreatedSurveyComponent.
   */
  constructor(
    private topicsService: TopicsService,
    private userService: UserService,
  ) { }

  /**
   * Init method of the component.
   *
   * Get result and current user.
   */
  initialize(): void {
    this.result = this.topicsService.formatSurveyResult(this.topic);
    this.user = this.userService.getCurrentUserValue();

    // need to check if the user exist in case the user is a guest
    if (this.user) {
      this.userHasVoted = this.result.result.some((res) => {
        return res.usersId.some((userId) => {
          return userId === this.user.id;
        });
      });
    }
  }

  /**
   * Emit answer event.
   */
  emitAnswer(answer: Answer): void {
    this.answer.emit(answer);

    // update answers/result of the survey.
    if (this.result.result.some((res) => res.id === answer.id)) {
      for (let i = 0; i < this.result.result.length; i++) {
        if (this.result.result[i].id === answer.id) {
          this.result.result[i].usersId.push(this.user.id);
          this.result.result[i].count += 1;
        }
      }
    } else {
      this.result.result.push({
        id: answer.id,
        usersId: [this.user.id],
        count: 1,
      });
    }

    this.result.count += 1;
    this.userHasVoted = true;
  }

  /**
   * Get answer result.
   */
  getResult(id: number) {
    return this.result.result.find((el) => el.id === id);
  }

  /**
   * Switch from survey to survey result & vice versa.
   */
  switch(): void {
    this.displaying = this.displaying === 'result' ? 'vote' : 'result';
  }
}
