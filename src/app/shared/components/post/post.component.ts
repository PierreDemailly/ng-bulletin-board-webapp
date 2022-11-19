import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Scavenger } from '@wishtack/rx-scavenger';

import { Post } from '@interfaces/post';
import { User } from '@interfaces/user';
import { UserService } from '@services/user.service';

/**
 * Post component.
 *
 * Display card with user & post's content.
 */
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnDestroy {
  /**
   * Whether current user is logged in (not a guest).
   */
  _isAuth: Boolean;
  /**
   * isAuht @Input() with setter.
   */
  @Input('isAuth')
  set isAuth(value: Boolean) {
    this._isAuth = value;
    // if current user is auth, get the current user
    if (this.isAuth) {
      this.getCurrentUser();
    }
  }
  /**
   * Current user.
   */
  currentUser: User;
  /**
   * Edit post form.
   */
  form: UntypedFormGroup;
  /**
   * Whether user is edditing the post.
   */
  editingPost = false;
  /**
   * Used to collect subscriptions and prevent memory leaks.
   */
  scavenger = new Scavenger(this);
  /**
   * Post to display.
   */
  @Input() post: Post;
  /**
   * Event sent when current user wanna blacklist the post's author.
   */
  @Output() blacklistUser = new EventEmitter<User>();
  /**
   * Event sent when current user wanna unblacklist the post's author.
   */
  @Output() unblacklistUser = new EventEmitter<User>();
  /**
   * Event sent when user wanna refresh the replies.
   */
  @Output() refreshReplies = new EventEmitter<void>();
  /**
   * Event sent when user quote the post.
   */
  @Output() quote = new EventEmitter<Post>();
  /**
   * Event sent when user wanna add reply.
   */
  @Output() reply = new EventEmitter<void>();
  /**
   * Event sent when user wanna return to the topics list.
   */
  @Output() returnToTopics = new EventEmitter<void>();
  /**
   * Event sent when user wanna edit his post.
   */
  @Output() edit = new EventEmitter<Post>();
  /**
   * isAuth getter.
   */
  get isAuth(): Boolean {
    return this._isAuth;
  }

  /**
   * Creates an instance of PostComponent.
   */
  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.buildForm();
  }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   *
   * This component implements ngOnDestroy for scavenger.
   */
  ngOnDestroy() { }

  /**
   * Build the form with FormBuidler.
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      content: [null, [Validators.minLength(1), Validators.maxLength(5000)]],
    });
  }

  /**
   * Subscribes to current user.
   */
  getCurrentUser(): void {
    this.userService.getCurrentUser().pipe(
      this.scavenger.collect(),
    ).subscribe((user) => {
      this.currentUser = user;
    });
  }

  /**
   * Redirect to author profile page.
   */
  redirectToAuthorProfilePage(id: number) {
    this.router.navigateByUrl(`/account/${id}`);
  }

  /**
   * Method used to check if user is allowed to edit his post.
   */
  allowedToEdit(): boolean {
    if (this.currentUser.id !== this.post.id) {
      return false;
    }

    const postTime = new Date(this.post.created_at).getTime();
    const time = new Date().getTime();

    // post must be created less than 5 minutes to allow edit
    return time - postTime <= 1000 * 60 * 60;
  }

  /**
   * Add post content to form content value.
   *
   * Then allow edit.
   */
  editPost(): void {
    this.form.get('content').setValue(this.post.content);
    this.editingPost = true;
  }


  /***************************
   *                         *
   *     EVENTS EMITTERS     *
   *                         *
   **************************/

  emitBlacklist(post: Post): void {
    this.blacklistUser.emit(post.user);
  }

  emitUnblacklist(post: Post): void {
    this.unblacklistUser.emit(post.user);
  }

  emitQuote(post: Post): void {
    this.quote.emit(post);
  }

  emitEdit(): void {
    if (this.form.valid) {
      this.post.content = this.form.value.content;
      this.edit.emit(this.post);
      this.editingPost = false;
    }
  }

  /***************************
   *                         *
   *     EVENTS HANDLERS     *
   *                         *
   **************************/

  handleReply(): void {
    this.reply.emit();
  }

  handdleRefreshReplies(): void {
    this.refreshReplies.emit();
  }

  handdleReturnToTopics(): void {
    this.returnToTopics.emit();
  }
}
