import { Component, OnInit, Input } from '@angular/core';
import { Country, Locale } from '../../../+models';
import { CountryService, EventService } from '../../../+services';

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

  countryOf(languageCode: string): Country {
    return CountryService.find(languageCode);
  }
}