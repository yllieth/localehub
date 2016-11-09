import { Component, OnInit, Input } from '@angular/core';
import { Locale } from '../../../+models/locale';
import { EventService } from '../../../+services/events.service';

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

  formatForFlagAsset(language: string): string {
    let parts = language.split('-');
    return (parts.length === 2) ? parts[1].toLowerCase() : language;
  }
}