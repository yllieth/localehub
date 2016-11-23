import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { ApplicationError } from '../+models';

@Injectable()
export class ErrorService {
  constructor(private router: Router) { }

  static init(errorId: string, metadata?: any): ApplicationError {
    return new ApplicationError(errorId, metadata);
  }

  static log(errorId: string, metadata: any) {
    let error = ErrorService.init(errorId, metadata);
    console.error('ERROR: ' + errorId + ': ' + error.userMessage, error);
  }

  handleHttpError(errorId: string, metadata?: any, log: boolean = true) {
    if (log === true) {
      ErrorService.log(errorId, metadata);
    }

    this.router.navigate(['error', errorId]);
  }
}