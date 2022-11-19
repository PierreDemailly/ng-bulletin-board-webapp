import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '@interfaces/user';
import { AlertService } from '@services/alert.service';
import { UserService } from '@services/user.service';
import { Subject } from 'rxjs/internal/Subject';

/**
 * Account component.
 *
 * Display informations about a user.
 */
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  /**
   * Current user.
   */
  currentUser: User;
  /**
   * User to display informations.
   */
  user: User;
  /**
   * Used to collect subscriptions and prevent memory leaks.
   */
  scavenger = new Subject();

  /**
   * Creates an instance of AccountComponent.
   */
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
  ) { }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngOnInit() {
    this.initialize();
  }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   *
   * This component implements ngOnDestroy for scavenger.
   */
  ngOnDestroy() { }

  /**
   * Init method of the component.
   *
   * Subscribes to current user and get user to display informations.
   */
  async initialize(): Promise<void> {
    this.userService.getCurrentUser().pipe(
    ).subscribe((user) => {
      this.currentUser = user;
    });

    const userId = this.route.snapshot.params.id;

    try {
      this.user = await this.userService.find(userId);
    } catch (error) {
      // redirect user to home, useless to stay here if cannot find user
      this.router.navigateByUrl('/');
      // notify
      this.alertService.warn('L\'utilisateur n\'a pas été trouvé');
      throw new Error(error);
    }
  }

  /**
   * Redirect user to edit account page.
   */
  editProfile(): void {
    this.router.navigateByUrl(`/account/${this.currentUser.id}/edit`);
  }
}
