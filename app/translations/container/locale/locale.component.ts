import { Component, OnInit, Input } from '@angular/core';
import { Locale, Translation } from '../../../+models';
import { EventService } from '../../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-locale',
  templateUrl: 'locale.component.html',
  styleUrls: [ 'locale.component.css' ]
})
export class TranslationsLocaleComponent implements OnInit {
  @Input() locale: Locale;
  isSavingTranslation: boolean;

  constructor() { }

  ngOnInit() {
    this.locale.expand(false);
    this.isSavingTranslation = false;

    EventService
      .get('titlebar::expand-locales')
      .subscribe(value => this.locale.expand(value));
  }

  edit(translation: Translation): void {
    if (this.isSavingTranslation === false) {
      translation.editedString = translation.string;
    }
  }

  cancelEdition(translation: Translation): void {
    if (this.isSavingTranslation === false) {
      translation.editedString = null;
    }
  }

  saveEdition(translation: Translation): void {
    this.isSavingTranslation = true;
  }
}