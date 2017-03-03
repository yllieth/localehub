import { Component, OnInit, Input } from '@angular/core';
import { Language, Locale } from '../../+models';

@Component({
  moduleId: module.id,
  selector: 'lh-new-locale',
  templateUrl: 'new-locale.component.html',
  styleUrls: [ 'new-locale.component.css' ]
})
export class TranslationsNewLocaleComponent implements OnInit {
  @Input() languages: Language[];     // list of supported languages
  @Input() keyPath: string[];         // depend on selected locale folder

  temporaryLocale: Locale;
  isSaving: boolean;

  constructor() { }

  ngOnInit() {
    this.temporaryLocale = new Locale('', null, null, this.languages);
    this.isSaving = false;
  }

  onSave(): void {
    this.isSaving = true;
  }

  onCancel(): void {
    this.isSaving = false;
  }
}