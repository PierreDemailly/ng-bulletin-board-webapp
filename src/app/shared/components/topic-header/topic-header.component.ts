import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Topic } from '@interfaces/topic';

/**
 * Topic header component.
 *
 * Display topic title and topic actions:
 * - add reply
 * - back to topics list
 * - update replies
 */
@Component({
  selector: 'app-topic-header',
  templateUrl: './topic-header.component.html',
  styleUrls: ['./topic-header.component.scss'],
})
export class TopicHeaderComponent {
  /**
   * Topic reference.
   */
  @Input() post: Topic;
  /**
   * Whether current user is allowed to reply.
   */
  @Input() allowedReply: boolean;
  /**
   * Event sent when user wanna reply.
   */
  @Output() reply = new  EventEmitter<void>();
  /**
   * Event sent when user wanna back to topics.
   */
  @Output() returnToTopics = new EventEmitter<void>();
  /**
   * Event sent when user wanna refresh replies.
   */
  @Output() refresh = new EventEmitter<void>();

  /**
   * Creates an instance of TopicHeaderComponent.
   */
  constructor() { }

  /**
   * ReturnToTopics event emitter.
   */
  emitReturnToTopics(): void {
    this.returnToTopics.emit();
  }

  /**
   * Refresh event emitter.
   */
  emitRefresh(): void {
    this.refresh.emit();
  }

  /**
   * Reply event emitter.
   */
  emitReply(): void {
    this.reply.emit();
  }
}
