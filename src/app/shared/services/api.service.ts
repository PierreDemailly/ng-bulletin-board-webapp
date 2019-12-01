import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment as env } from '@env/environment';

import { map } from 'rxjs/operators';

/**
 * Api service of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * Default options for http.
   */
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
    // need to observe response to access requests headers
    observe: 'response',
  };

  /**
   * Creates an instance of ApiService.
   */
  constructor(private http: HttpClient) { }

  /**
   * Store (or update) header's token if present.
   */
  checkToken(token: string): void {
    if (token && token.length > 0) {
      localStorage.setItem('jwtToken', token);
    }
  }

  /**
   * Make a http GET method request.
   */
  get(path: string, options: Object = this.httpOptions): Promise<any> {
    return this.http.get<any>(env.apiUrl + path, options).pipe(
      map((res) => {
        this.checkToken(res.headers.get('Authorization'));
        return res.body;
      }),
    ).toPromise();
  }

  /**
   * Make a http POST method request.
   */
  post(url: string, body: object, options: Object = this.httpOptions): Promise<any> {
    // if we won't add options set an empty headers
    // this is usefull for post FormData, we won't send it as JSON
    if (options === null) {
      options = {
        headers: new HttpHeaders({}),
        observe: 'response',
      };
    }
    return this.http.post<any>(env.apiUrl + url, body, options).pipe(
      map((res) => {
        this.checkToken(res.headers.get('Authorization'));
        return res.body;
      }),
    ).toPromise();
  }

  /**
   * Make a http PUT method request.
   */
  put(url: string, body: object, options: Object = this.httpOptions): Promise<any> {
    return this.http.put<any>(env.apiUrl + url, body, options).pipe(
      map((res) => {
        this.checkToken(res.headers.get('Authorization'));
        return res.body;
      }),
    ).toPromise();
  }

  /**
   * Make a http DELETE method request.
   */
  delete(url: string, options: object = this.httpOptions): Promise<any> {
    return this.http.delete<any>(env.apiUrl + url, options).pipe(
      map((res) => {
        this.checkToken(res.headers.get('Authorization'));
        return res.body;
      }),
    ).toPromise();
  }
}
