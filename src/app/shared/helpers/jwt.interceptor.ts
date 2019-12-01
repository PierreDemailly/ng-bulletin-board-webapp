import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '@services/auth.service';

import { Observable } from 'rxjs/internal/Observable';

/**
 * JWT interceptor of the app.
 *
 * Add JWT to each request if user is logged in.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   * Creates an instance of JwtInterceptor.
   */
  constructor(private authService: AuthService) {}

  /**
   * @inheritdoc
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get the token
    const jwt = localStorage.getItem('jwtToken');

    // check whether user is logged in
    if (jwt && this.authService.isLoggedIn()) {
      // clone the request adding token header
      request = request.clone({
        setHeaders: {
          token: `${jwt}`,
        },
      });
    }

    // return the request
    return next.handle(request);
  }
}
