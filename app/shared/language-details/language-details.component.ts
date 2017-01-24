import { Component, OnInit, Input } from '@angular/core';
import { I18nFileInfo, Language } from '../../+models';
import { LanguageService } from '../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-language-details',
  templateUrl: 'language-details.component.html',
  styleUrls: [ 'language-details.component.css' ]
})
export class LanguageDetailsComponent implements OnInit {
  @Input() file: I18nFileInfo;
  @Input() languages: I18nFileInfo[];
  language: Language;
  missingTranslations: number;

  constructor() { }

  ngOnInit() {
    this.language = LanguageService.find(this.file.languageCode);
    this.missingTranslations = Math.max(...this.languages.map(language => language.count)) - this.file.count;
  }
}