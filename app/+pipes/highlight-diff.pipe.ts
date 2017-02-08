import { Injectable, PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'highlightDiff',
  pure: true
})
@Injectable()
export class HighlightDiffPipe implements PipeTransform {
  /**
   * Add a span around differences
   *
   * @example `{{ "This is a new string" | highlight-diff: "This is a old string" }}` => "This is a <span class="diff">new</span> string"
   *
   * @param {string} value Input string passed to the filter.
   * @param {string} compareWith The string to compare the input value with
   * @param {string} [cssClass="diff"] The css class added in the span
   * @returns {string}
   */
  transform(value: string, compareWith: string, cssClass: string): string {


    return value;
  }
}
