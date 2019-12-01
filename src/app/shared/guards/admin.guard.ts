import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '@services/user.service';

import { map, take } from 'rxjs/operators';

/**
 * Admin guard of the app.
 *
 * Check user is allowed to access admin.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  /**
   * Creates an instance of AdminGuard.
   */
  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  canActivate() {
    return new Promise<boolean>((resolve) => {
      this.userService.getUnloadedUser().then((user) => {
        if (user.rank > 1) { resolve(true); } else {
          this.router.navigateByUrl('/forums');
          resolve(false);
        }
      }).catch(() => {
        this.router.navigateByUrl('/forums');
        resolve(false);
      });
    });
  }
}
