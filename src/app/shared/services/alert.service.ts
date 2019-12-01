import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

/**
 * Alert service of the component.
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  /**
   * Creates an instance of AlertService.
   */
  constructor(private snackBar: MatSnackBar) { }

  /**
   * Make a success alert.
   */
  success(message: string): void {
    this.snackBar.open(message, 'ok', {
      duration: 5000,
      // custom class available in styles.scss
      panelClass: ['snackbar-success'],
    });
  }

  /**
   * Make a warn alert.
   */
  warn(message: string): void {
    this.snackBar.open(message, 'ok', {
      duration: 5000,
      // custom class available in styles.scss
      panelClass: ['snackbar-warn'],
    });
  }
}
