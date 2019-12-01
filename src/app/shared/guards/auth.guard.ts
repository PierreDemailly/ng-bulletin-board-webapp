import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '@services/auth.service';

/**
 * Auth guard of the app.
 *
 * Check the user is logged in.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Creates an instance of AuthGuard.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  /**
   * Interface that a class can implement to be a guard deciding if a route can be activated.
   * If all guards return true, navigation will continue. If any guard returns false, navigation will be cancelled.
   * If any guard returns a UrlTree, current navigation will be cancelled and a new navigation
   * will be kicked off to the UrlTree returned from the guard.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
