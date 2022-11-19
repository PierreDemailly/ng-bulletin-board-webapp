import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';

import { User } from '@interfaces/user';
import { AuthService } from '@services/auth.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

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
  scavenger = new Subject();

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
      finalize(() => {
        // when subject complete (after logout)
        delete this.user;
        this.isAuth = false;
      }),
      takeUntil(this.scavenger)
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
  ngOnDestroy() {
    this.scavenger.complete();
    this.scavenger.unsubscribe();
  }
}
