import { Injectable } from '@angular/core';

@Injectable()
export class Utils {
  static deepSetter(obj: any, path: string[], value: string): void {
    let i = 0;
    for (i = 0; i < path.length - 1; i++) {
      if (obj.hasOwnProperty(path[i]) === false) {
        obj[path[i]] = {};
      }
      obj = obj[path[i]];
    }

    obj[path[i]] = value;
  }
}