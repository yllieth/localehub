// Inspired from http://youknowriad.github.io/angular2-cookbooks/pipe.html

import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'truncate',
  pure: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number, trail: string) : string {
    limit = limit || 10;
    trail = trail || '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}