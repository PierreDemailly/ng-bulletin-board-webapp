import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';

import { AlertService } from '@services/alert.service';
import { AuthService } from '@services/auth.service';
import { NavigationService } from '@services/navigation.service';
import { SettingsService } from '@services/settings.service';
import { SidenavService } from '@services/sidenav.service';
import { UserService } from '@services/user.service';

import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject } from 'rxjs/internal/Subject';
import { filter, takeUntil } from 'rxjs/operators';

/**
 * Default layout.
 *
 * Set header, sidenav and content in material styles and
 * init somethings for app.
 */
@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Define if the component is being initialized.
   */
  loading: boolean;
  /**
   * Define if user run the app on mobile device.
   */
  isMobile: boolean;
  /**
   * Define if user run the app on tablet device.
   */
  isTablet: boolean;
  /**
   * Define if user run the app on desktop device.
   */
  isDesktop: boolean;
  /**
   * Used to collect subscriptions and prevent memory leaks.
   */
  scavenger = new Subject();
  /**
   * Reference to the sidenav.
   */
  @ViewChild('sideNavigation') sidenav: MatSidenav;

  /**
   * Creates an instance of DefaultLayoutComponent.
   */
  constructor(
    private settingsService: SettingsService,
    private sidenavService: SidenavService,
    private authService: AuthService,
    private userService: UserService,
    private deviceService: DeviceDetectorService,
    private router: Router,
    private navigationService: NavigationService,
    private alertService: AlertService,
  ) { }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngOnInit(): void {
    this.initialize();
  }

  /**
   * @inheritdoc
   * See Angular lifecycle hooks: https://angular.io/guide/lifecycle-hooks.
   */
  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
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

  /**
   * Init method of the component.
   *
   * Load user if empty currentUser but valid jwt in localStorage.
   *
   * Check which device the user run the app on.
   *
   * Get settings and store them in subject so they can be used in the whole app.
   *
   * Everytime the page change, store it subject so it can be used in the whole app.
   */
  async initialize(): Promise<void> {
    this.loading = true;

    const isLoggedIn = this.authService.isLoggedIn();
    const currentUser = this.userService.getCurrentUserValue();

    if (isLoggedIn && !(!!currentUser)) {
      this.userService.loadUser();
    }

    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktop = this.deviceService.isDesktop();
    // open the sidenav by default only if user doesn't use mobile device
    this.sidenavService.setOpened(!this.isMobile);

    try {
      const settings = await this.settingsService.getAll();
      this.settingsService.setSettings(settings);
    } catch (e) {
      // notify
      this.alertService.warn('Impossible de récupérer les paramètres de l\'application, veuillez recharger la page.');
      throw new Error(e);
    }

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.scavenger),
    ).subscribe((event: NavigationEnd) => {
      this.navigationService.setCurrentPage(event.url);
    });

    this.loading = false;
  }
}
