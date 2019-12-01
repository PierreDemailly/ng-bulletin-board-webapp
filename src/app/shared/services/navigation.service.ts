import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

/**
 * Navigation service of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  /**
   * Current page subject.
   */
  currentPageSubject = new BehaviorSubject<string>('');

  /**
   * Set the current page.
   */
  setCurrentPage(page: string): void {
    this.currentPageSubject.next(page);
  }

  /**
   * Current page the current user is located.
   * Each page start with '/'.
   *
   * @exemple '/home'
   */
  getCurrentPage(): Observable<string> {
    return this.currentPageSubject.asObservable();
  }
}
