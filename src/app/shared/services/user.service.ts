import { Injectable } from '@angular/core';

import { User } from '@interfaces/user';
import { UserResult } from '@interfaces/user-result';
import { ApiService } from './api.service';

import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * User service of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * subject of the logged in user
   */
  currentUserSubject = new BehaviorSubject<User>(null);
  /**
   * helper library for handling jwt
   */
  jwtHelper = new JwtHelperService();

  /**
   * creates an instance of UserService.
   */
  constructor(private apiService: ApiService) { }

  /**
   * get current user subject for subscribing to it
   */
  getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  /**
   * get current value of current user subject
   */
  getCurrentUserValue(): User {
    return this.currentUserSubject.getValue();
  }

  /**
   * set new value for the current user subject
   */
  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  /**
   * get the user from jwt and set it in subject
   */
  async loadUser(): Promise<void> {
    const jwt = localStorage.getItem('jwtToken');

    const userId = this.jwtHelper.decodeToken(jwt).id;

    try {
      const user = await this.find(userId);
      this.setUser(user);
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * get filtered users depending page/limit
   */
  getAll(page: number, limit: number): Promise<UserResult> {
    return this.apiService.get(`/users?page=${page}&limit=${limit}`);
  }

  /**
   * find a user
   */
  find(userId: number): Promise<User> {
    return this.apiService.get('/users/' + userId);
  }

  /**
   * add user in database
   */
  add(user: User): Promise<User> {
    return this.apiService.post('/users', user);
  }

  /**
   * edit a user
   */
  edit(user: User): Promise<User> {
    return this.apiService.put('/users', user);
  }

  /**
   * delete a user
   */
  delete(user: User): Promise<void> {
    return this.apiService.delete('/users/' + user.id);
  }

  /**
   * add a user to blacklist
   */
  blacklist(user: User, userToBlacklist: User): Promise<User> {
    const body = {
      userId: user.id,
      blacklistedUserId: userToBlacklist.id,
    };

    return this.apiService.post('/users/blacklist', body);
  }

  /**
   * remove a user from blacklist
   */
  unblacklist(user: User, userToUnblacklist: User): Promise<User> {
    const body = {
      userId: user.id,
      unblacklistedUserId: userToUnblacklist.id,
    };

    return this.apiService.post('/users/unblacklist', body);
  }

  /**
   * search filtered users depending search string and page/limit
   */
  search(searchString: string, page: number, limit: number): Promise<UserResult> {
    return this.apiService.post(`/users/search?page=${page}&limit=${limit}`, { searchString });
  }

  getUnloadedUser(): Promise<User> {
    const jwt = localStorage.getItem('jwtToken');
    if (!jwt || this.jwtHelper.isTokenExpired(jwt)) { return; }

    const userId = this.jwtHelper.decodeToken(jwt).id;
    if (!userId) { return; }

    try {
      return this.find(userId);
    } catch (e) {
      throw new Error(e);
    }
  }
}
