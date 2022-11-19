import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Scavenger } from '@wishtack/rx-scavenger';

import { Survey } from '@interfaces/survey';

/**
 * Survey component.
 *
 * Display a form to create survey.
 */
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit, OnDestroy {
  /**
   * Survey form.
   */
  form: UntypedFormGroup;
  /**
   * Used to collect subscriptions and prevent memory leaks.
   */
  scavenger = new Scavenger(this);
  /**
   * Event sent anytime form values change.
   */
  @Output() valueChange = new EventEmitter<Survey>();

  get answers(): UntypedFormGroup {
    return this.form.get('answers') as UntypedFormGroup;
  }

  /**
   * Creates an instance of SurveyComponent.
   */
  constructor(private formBuilder: UntypedFormBuilder) {
    this.buildForm();
  }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngOnInit() {
    this.form.valueChanges.subscribe((values) => {
      this.valueChange.emit(values);
    });
  }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   *
   * This component implements ngOnDestroy for scavenger.
   */
  ngOnDestroy() { }

  /**
   * Build form with FormBuilder.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      title: [null, Validators.required],
      answers: this.formBuilder.array([
        this.formBuilder.group({ answer: [null, Validators.required]}),
        this.formBuilder.group({ answer: [null, Validators.required]}),
      ]),
    });
  }

  /**
   * Add answer input, max 10.
   */
  addAnswer(): void {
    const answers = this.form.get('answers') as UntypedFormArray;
    answers.push(this.formBuilder.group({
      answer: [null, Validators.required],
    }));
  }

  /**
   * Remove answer input, min 2.
   */
  removeAnswer(index: number): void {
    const answers = this.form.get('answers') as UntypedFormArray;
    answers.removeAt(index);
  }
}
