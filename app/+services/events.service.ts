import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventService {
  private static emitters: { [ID: string]: EventEmitter<any> } = {};

  static get(ID: string): EventEmitter<any> {
    if (!this.emitters[ID]) {
      this.emitters[ID] = new EventEmitter();
    }

    return this.emitters[ID];
  }
}