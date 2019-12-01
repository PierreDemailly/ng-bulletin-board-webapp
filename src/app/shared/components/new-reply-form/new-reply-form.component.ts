import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Reply } from '@interfaces/reply';
import { Topic } from '@shared/interfaces/topic';

/**
 * New reply form component.
 *
 * Display NgPrime Editor (wysiwyg) inside form.
 */
@Component({
  selector: 'app-new-reply-form',
  templateUrl: './new-reply-form.component.html',
  styleUrls: ['./new-reply-form.component.scss'],
})
export class NewReplyFormComponent {
  /**
   * Reply form.
   */
  form: FormGroup;
  /**
   * Editor content (ngModel).
   */
  content: string;
  /**
   * Date pipe used to format date.
   */
  pipe = new DatePipe('fr-FR');

  /**
   * Reply event sent when user submit form.
   */
  @Output() reply = new EventEmitter<String>();

  /**
   * Quote @Input() with setter.
   *
   * When user quote a post, directely add it to content.
   */
  @Input('quote')
  set quote(post: Topic | Reply) {
    if (post) {
      const quote = `
        <blockquote>Par ${post.user.pseudo} ${this.formatDate(
        post.created_at,
      )}:</blockquote>
        <blockquote>${post.content}</blockquote>
      `;
      this.content = this.content ? this.content : '';
      this.content += quote;
    }
  }

  /**
   * Creates an instance of NewReplyFormComponent.
   */
  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  /**
   * Format date using Date pipe.
   */
  formatDate(date: string): string {
    return this.pipe.transform(date, 'medium');
  }

  /**
   * Build form with FormBuilder.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      content: ['', Validators.required],
    });
  }

  /**
   * Emit reply to parent component.
   */
  emitReply(): void {
    if (this.form.valid) {
      this.reply.emit(this.form.value.content);
      this.form.reset();
    }
  }
}
