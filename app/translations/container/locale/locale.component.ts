import { Component, OnInit, Input } from '@angular/core';
import { Locale } from '../../../+models';
import { EventService, FlagService } from '../../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-locale',
  templateUrl: 'locale.component.html',
  styleUrls: [ 'locale.component.css' ]
})
export class TranslationsLocaleComponent implements OnInit {
  @Input() locale: Locale;

  constructor() { }

  ngOnInit() {
    this.locale.expand(false);

    EventService
      .get('titlebar::expand-locales')
      .subscribe(value => this.locale.expand(value));
  }

  flagOf(countryCode: string): string {
    return FlagService.getClassName(countryCode);
  }

  languageName(countryCode: string): string {
    return FlagService.getLanguageName(countryCode);
  }
}