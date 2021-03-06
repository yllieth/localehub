import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Language, Locale, LocaleFolder, Project } from '../../+models';
import { EventService, LanguageService, ProjectsService } from '../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-new-locale',
  templateUrl: 'new-locale.component.html',
  styleUrls: [ 'new-locale.component.css' ]
})
export class TranslationsNewLocaleComponent implements OnInit, OnDestroy {
  @Input() languages: Language[];     // list of supported languages
  @Input() keyPath: string[];         // depend on selected locale folder
  @Input() project: Project;
  @Output() savedLocale = new EventEmitter<Locale>();

  temporaryLocale: Locale;
  isSaving: boolean;
  key: string; // ngModel of the typed key part
  values: any; // ngModel od the typed value

  constructor(private projectsService: ProjectsService) { }

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

  canBeSaved(): boolean {
    let hasKey = this.key !== undefined && this.key.length > 0;
    let hasValue = false;
    for (let languageCode in this.values) {
      if (this.values[languageCode] !== null && typeof this.values[languageCode] === 'string' && this.values[languageCode].length > 0) {
        hasValue = true;
        break;
      }
    }

    return hasKey && hasValue;
  }

  onSave(): void {
    this.isSaving = true;
    this.temporaryLocale.setKey(this.getKeyParts().join('.') + '.' + this.key);

    // add one translation for each setted languages
    for (let languageCode in this.values) {
      if (this.values[languageCode] !== null) {
        this.temporaryLocale.addTranslation(LanguageService.find(languageCode), this.values[languageCode], this.languages, true);
      }
    }

    this.projectsService
      .update(this.project.id, 'append-pendingChanges', this.temporaryLocale.toLocaleUpdate(ProjectsService.workingVersionName(this.project)))
      .then(updatedProject => {
        // Notify titlebar
        EventService.get('translations::updated-changes').emit(updatedProject.pendingChanges);

        // Internal updates
        this.isSaving = false;
        this.project = updatedProject;

        // New locale in the list

        // Close component
        this.savedLocale.emit(this.temporaryLocale);
      });
  }
}