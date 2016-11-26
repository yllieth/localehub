import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
  public static endpoint = {
    prod: 'https://hrjyk83zp5.execute-api.eu-central-1.amazonaws.com/prod',
    mock: 'http://localhost:3002'
  };
}