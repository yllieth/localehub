import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Language, Locale, LocaleFolder } from '../../+models';
import { LanguageService } from '../../+services';
import {LocaleUpdate} from "../../+models/localeUpdate";

@Component({
  moduleId: module.id,
  selector: 'lh-new-locale',
  templateUrl: 'new-locale.component.html',
  styleUrls: [ 'new-locale.component.css' ]
})
export class TranslationsNewLocaleComponent implements OnInit, OnDestroy {
  @Input() languages: Language[];     // list of supported languages
  @Input() keyPath: string[];         // depend on selected locale folder

  temporaryLocale: Locale;
  isSaving: boolean;
  key: string; // ngModel of the typed key part
  values: any; // ngModel od the typed value

  constructor() { }

  ngOnInit() {
    this.temporaryLocale = new Locale('', null, null, this.languages);
    this.isSaving = false;
    this.values = {};

    for (let language of this.languages) {
      this.values[language.languageCode] = null;
    }
  }

  ngOnDestroy() {
    this.isSaving = false;
    this.key = undefined;
    this.values = {};
  }

  getKeyParts(): string[] {
    return (this.keyPath.length === 1 && this.keyPath[0] === LocaleFolder.ROOT_NAME) ? [] : this.keyPath;
  }

  onSave(): void {
    this.isSaving = true;
    this.temporaryLocale.setKey(this.getKeyParts().join('.') + '.' + this.key);

    for (let languageCode in this.values) {
      if (this.values[languageCode] !== null) {
        this.temporaryLocale.addTranslation(LanguageService.find(languageCode), this.values[languageCode], this.languages, true);
      }
    }
  }
}