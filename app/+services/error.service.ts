import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { ApplicationError } from '../+models/application-error';

@Injectable()
export class ErrorService {
  constructor(private router: Router) { }

  init(errorId: string, metadata: any): ApplicationError {
    return new ApplicationError(errorId, metadata);
  }

  log(errorId: string, metadata: any) {
    let error = this.init(errorId, metadata);
    console.error('ERROR: ' + errorId + ': ' + error.userMessage, error);
  }

  handleHttpError(errorId: string, metadata: any, log: boolean = true) {
    if (log === true) {
      this.log(errorId, metadata);
    }

    this.router.navigate(['error', errorId]);
  }
}