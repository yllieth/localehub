import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
  public static endpoint: string = 'https://hrjyk83zp5.execute-api.eu-central-1.amazonaws.com/prod';
  public static baseUrl: string = 'http://localhost:3002'
}