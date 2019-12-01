import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '@services/auth.service';

import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';

/**
 * Error interceptor of the app.
 *
 * Logout user if 401
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * Creates an instance of ErrorInterceptor.
   */
  constructor(private authService: AuthService) {}

  /**
   * @inheritdoc
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err) => {
      if (err.status === 401) {
        console.log('TEST');
        /** No token, logout */
        this.authService.logout();
      }

      return throwError(err);
    }));
  }
}
