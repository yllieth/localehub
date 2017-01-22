import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions } from '@angular/http';
import { AuthenticationService } from './';

@Injectable()
export class ApiService extends Http {
  public static endpoint = {
    prod: 'https://hrjyk83zp5.execute-api.eu-central-1.amazonaws.com/prod',
    mock: 'http://localhost:3002'
  };

  constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
    defaultOptions.headers.set('Authorization', AuthenticationService.getToken());
    defaultOptions.headers.set('Content-Type', 'application/json');

    super(backend, defaultOptions);
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