import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Survey } from '@interfaces/survey';
import { Topic } from '@interfaces/topic';
import { AlertService } from '@services/alert.service';

import { ReCaptcha2Component } from 'ngx-captcha';

/**
 * New topic form component.
 *
 * Display NgPrime Editor (wysiwyg) inside form.
 *
 * User may create survey for his topic.
 */
@Component({
  selector: 'app-new-topic-form',
  templateUrl: './new-topic-form.component.html',
  styleUrls: ['./new-topic-form.component.scss'],
})
export class NewTopicFormComponent implements OnInit {
  /**
   * Topic form.
   */
  form: FormGroup;
  /**
   * Whether user wanna add survey or not.
   */
  addSurvey = false;
  /**
   * Topic's survey.
   */
  survey: Survey;
  /**
   * ReCaptcha reference.
   */
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  /**
   * Topic event sent when user submit form.
   */
  @Output() topic = new EventEmitter<Topic>();

  /**
   * Creates an instance of NewTopicFormComponent.
   */
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
  ) { }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngOnInit() {
    this.buildForm();
  }

  /**
   * Build form with FormBuilder.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      captcha: [null, [Validators.required]],
    });
  }

  /**
   * Topic form submit.
   *
   * Emit topic to parent component.
   */
  addTopic(): void {
    const validate = this.validateSurvey();
    // check form and survey are valid
    if (this.form.valid && validate) {
      const topic: Topic = this.form.value;
      topic.survey = this.survey || null;

      this.topic.emit(topic);
      // useless while user is redirected to his topic page
      this.captchaElem.resetCaptcha();
    }
  }

  /**
   * Show/Hide survey.
   */
  toggleSurvey(): void {
    this.addSurvey = !this.addSurvey;
  }

  /**
   * Update survey when value changes.
   */
  getSurveyValue(event: Survey): void {
    this.survey = event;
  }

  /**
   * Validate survey inside component instead with Validators
   * because it's simpler.
   *
   * TODO: refactor
   */
  validateSurvey(): boolean {
    // if no survey so it's valid
    if (!this.addSurvey || this.survey === undefined) {
      return true;
    }

    // check title
    if (this.survey.title === null || this.survey.title.length < 0 || this.survey.title.length > 100) {
      // notify
      this.alertService.warn('Le titre de votre sondage doit comprendre entre 1 et 100 charactères');
      return false;
    }

    for (let i = 0; i < this.survey.answers.length; i++) {
      const answer = this.survey.answers[i].answer;

      // check the 2 first values apart because required
      if (i === 0 || i === 1) {
        if (answer === null || answer.length < 1 || answer.length > 100) {
          // notify
          this.alertService.warn('Les 2 premières réponses de votre sondage doivent comprendre entre 1 et 100 charactères');
          return false;
        }
      } else {
        // remove empty answers
        if (answer.length < 1) {
          this.survey.answers.splice(i, 1);
        } else if (answer.length > 100) {
          // notify
          this.alertService.warn('Vos réponses doivent contenir entre 1 et 100 charactères');
          return false;
        }
      }
    }
    return true;
  }
}
