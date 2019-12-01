import { Injectable } from '@angular/core';

import { User } from '@interfaces/user';
import { ApiService } from './api.service';
import { UserService } from './user.service';

import { JwtHelperService } from '@auth0/angular-jwt';

/**
 * Auth service of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * JWT helper service. Usefull to decode or check expiration date of the JWT.
   */
  private jwtHelper = new JwtHelperService();

  /**
   * Creates an instance of AuthService.
   */
  constructor(
    private apiService: ApiService,
    private userService: UserService,
  ) { }

  /**
   * Send credentials (email + pw) to backend.
   *
   * If credentials are good, return the user and a jwt.
   */
  login(user: User): Promise<any> {
    return this.apiService.post('/auth/login', user);
  }

  /**
   * Logout the user removing the token and updates user subject.
   */
  logout(): void {
    localStorage.removeItem('jwtToken');
    this.userService.setUser(null);
  }

  /**
   * Determines whether user is logged in.
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwtToken') || '';
    return !this.jwtHelper.isTokenExpired(token);
  }
}
