import { Component, OnInit, Input } from '@angular/core';
import { Locale, LocaleUpdate, Project, Translation } from '../../../+models';
import { EventService, ProjectsService } from '../../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-locale',
  templateUrl: 'locale.component.html',
  styleUrls: [ 'locale.component.css' ]
})
export class TranslationsLocaleComponent implements OnInit {
  @Input() locale: Locale;
  @Input() project: Project;
  isSavingTranslation: boolean;
  isPending: true;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    this.locale.expand(false);
    this.isSavingTranslation = false;

    for(let change of this.project.pendingChanges) {
      if (change.key === this.locale.keyPath + this.locale.key && change.branch === this.project.lastActiveBranch) {
        this.isPending = true;
        this.locale.values.map((value: Translation) => {
          if (change.languageCode === value.language.languageCode) {
            value.string = change.value.newString;
            value.isPending = true;
          }
        })
      }
    }

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

    let update = new LocaleUpdate();
    update.languageCode = translation.language.languageCode;
    update.branch = this.project.lastActiveBranch;
    update.key = this.locale.keyPath + this.locale.key;
    update.value = {
      oldString: translation.string,
      newString: translation.editedString
    };

    this.projectsService
      .update(this.project.id, 'append-pendingChanges', update)
      .then(updatedProject => {
        this.isSavingTranslation = false;
        this.project = updatedProject;
        this.locale.values.map((value: Translation) => {
          this.isPending = true;
          if (value.language.languageCode === translation.language.languageCode) {
            value.string = translation.editedString;
            value.editedString = null;
            value.isPending = true;
          }
        })
      });
  }
}