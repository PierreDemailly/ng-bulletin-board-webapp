import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@interfaces/user';
import { AuthService } from '@services/auth.service';
import { NavigationService } from '@services/navigation.service';
import { SettingsService } from '@services/settings.service';
import { SidenavService } from '@services/sidenav.service';
import { UserService } from '@services/user.service';

import { finalize } from 'rxjs/internal/operators/finalize';
import { Subject } from 'rxjs/internal/Subject';

/**
 * Header component of the app.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  /**
   * Current user.
   */
  user: User;
  /**
   * Whether current user is logged in.
   */
  isLoggedIn = false;
  /**
   * Whether the sidenav is opened.
   */
  sidenavOpened = false;
  /**
   * Name of the app.
   */
  sitename: string;
  /**
   * Used to collect subscriptions and prevent memory leaks.
   */
  scavenger = new Subject();
  /**
   * The current page user is located.
   *
   * Current page start with "/"
   */
  currentPage: string;

  /**
   * Creates an instance of HeaderComponent.
   */
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private sidenavService: SidenavService,
    private settingsService: SettingsService,
    private navigationService: NavigationService,
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
  ngOnDestroy() {}

  /**
   * Init method of the component.
   *
   * Subscribes to:
   * - current user
   * - sidenav state (opened / closed)
   * - current page
   * - app settings
   */
  initialize(): void {
    this.userService.getCurrentUser().pipe(
      finalize(() => {
        // when subject complete (after logout)
        delete this.user;
        this.isLoggedIn = false;
      }),
    ).subscribe((user) => {
      this.user = user;
      this.isLoggedIn = this.authService.isLoggedIn();
    });

    this.sidenavService.opened().pipe(
    ).subscribe((value) => {
      this.sidenavOpened = value;
    });

    this.navigationService.getCurrentPage().pipe(
    ).subscribe((page) => {
      this.currentPage = page;
    });

    this.settingsService.getSettings().pipe(
    ).subscribe((settings) => {
      // only need sitename setting
      this.sitename = settings.find((s) => s.name === 'sitename').value;
    });
  }

  /**
   * Logout current user.
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Toggle sidenav.
   */
  toggleSidenav(): void {
    this.sidenavService.toggle();
  }

  /**
   * Redirect user to login page.
   */
  login(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Redirect user to register page.
   */
  register(): void {
    this.router.navigate(['/register']);
  }
}
