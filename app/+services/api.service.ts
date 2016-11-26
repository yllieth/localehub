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
}