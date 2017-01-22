import { Component, OnInit, Input } from '@angular/core';
import { Language, Locale } from '../../../+models';
import { EventService, LanguageService } from '../../../+services';

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

  countryOf(languageCode: string): Language {
    return LanguageService.find(languageCode);
  }
}