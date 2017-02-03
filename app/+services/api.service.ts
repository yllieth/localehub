import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from './';

@Injectable()
export class ApiService extends Http {
  public static endpoint = {
    prod: 'https://hrjyk83zp5.execute-api.eu-central-1.amazonaws.com/prod',
    mock: 'http://localhost:3002'
  };

  constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (!options) { options = new RequestOptions({}); }
    if (!options.headers) { options.headers = new Headers(); }

    // Adds Authorization header when a valid token is available
    if (AuthenticationService.hasToken(true)) {
      options.headers.append("Authorization", AuthenticationService.getToken())
    }

    // Always adds Content-Type header
    options.headers.append('Content-Type', 'application/json');

    if (url instanceof Request) { url.headers = options.headers; }

    return super.request(url, options)
  }

  // https://jsfiddle.net/briguy37/2MVFd/
  public static generateUUID(): string {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });

    return uuid;
  };
}