import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';

import { User } from '@interfaces/user';
import { AuthService } from '@services/auth.service';
import { Scavenger } from '@wishtack/rx-scavenger';
import { finalize } from 'rxjs/operators';

/**
 * Aside component.
 *
 * Contain links displayed into mat Sidenav.
 */
@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit, OnDestroy {
  /**
   * Define if current user is logged in.
   */
  isAuth: boolean;
  /**
   * Current user.
   */
  user: User;
  /**
   * Used to collect subscriptions and prevent memory leaks.
   */
  scavenger = new Scavenger(this);

  /**
   * Creates an instance of AsideComponent.
   */
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngOnInit() {
    this.userService.getCurrentUser().pipe(
      this.scavenger.collect(),
      finalize(() => {
        // when subject complete (after logout)
        delete this.user;
        this.isAuth = false;
      }),
    ).subscribe((user) => {
      this.user = user;
      this.isAuth = this.authService.isLoggedIn();
    });
  }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   *
   * This component implements ngOnDestroy for scavenger.
   */
  ngOnDestroy() {}
}
