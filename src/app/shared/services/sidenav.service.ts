import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Sidenav service of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  /**
   * Sidenav of the app.
   */
  sidenav: MatSidenav;
  /**
   * Sidenav opened state subject.
   */
  opened$ = new BehaviorSubject<boolean>(null);

  /**
   * Set sidenav.
   */
  setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  /**
   * Toggle sidenav.
   */
  toggle(): void {
    this.sidenav.toggle();
    this.opened$.next(this.opened$.getValue() ? false : true);
  }

  /**
   * Defines whether sidenav is opened.
   */
  setOpened(value: boolean): void {
    this.opened$.next(value);
  }

  /**
   * Whether sidenav is opened.
   */
  opened(): Observable<boolean> {
    return this.opened$.asObservable();
  }
}
