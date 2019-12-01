import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { User } from '@interfaces/user';

/**
 * Dialog user details component.
 *
 * Display some details about a user.
 *
 * @export
 */
@Component({
  selector: 'app-dialog-user-details',
  templateUrl: './dialog-user-details.component.html',
  styleUrls: ['./dialog-user-details.component.scss'],
})
export class DialogUserDetailsComponent implements OnInit {
  /**
   * User to show details.
   */
  private _user: User;
  /**
   * User @Input() setter.
   */
  @Input('user')
  set user(user: User) {
    this._user = user;
  }
  /**
   * User getter.
   */
  get user(): User {
    return this._user;
  }
  /**
   * Edit event sent when admin has edit user.
   */
  @Output() edit = new EventEmitter<User>();

  /**
   * Creates an instance of DialogUserDetailsComponent.
   */
  constructor() { }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngOnInit() {
  }

  /**
   * Emit edit event.
   */
  emitEdit(user: User): void {
    this.edit.emit(user);
  }
}
