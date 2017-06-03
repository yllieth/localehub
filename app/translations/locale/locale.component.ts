import { Component, OnInit, Input } from '@angular/core';
import { Locale, LocaleUpdate, Project, Translation } from '../../+models';
import { EventService, ProjectsService } from '../../+services';

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
  isPending: boolean;

  isSameTranslation(change: LocaleUpdate, translation: Translation, project?: Project) : boolean {
    project = project || this.project;

    return change.branch === ProjectsService.workingVersionName(project)
      && change.languageCode === translation.language.languageCode
      && change.value.newString === translation.string;
  }

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    this.locale.expand(false);
    this.isSavingTranslation = false;

    // add/highlight pending changes
    for(let change of this.project.pendingChanges) {
      if (change.key === this.locale.getCompleteKey() && change.branch === ProjectsService.workingVersionName(this.project)) {
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

  undo(translation: Translation): void {
    translation.$metadata.isProcessing = true;
    let newPendingChanges: LocaleUpdate[] = this.project.pendingChanges
      .filter(pendingChange => !this.isSameTranslation(pendingChange, translation));

    this.projectsService
      .update(this.project.id, 'set-pendingChanges', newPendingChanges)
      .then(updatedProject => {
        // Notify titlebar
        EventService.get('translations::updated-changes').emit(updatedProject.pendingChanges);

        translation.$metadata.isProcessing = false;
        this.project = updatedProject;
        this.locale.values.map((value: Translation) => {
          if (value.language.languageCode === translation.language.languageCode) {
            value.editedString = null;
            value.isPending = false;
          }
        });
        this.isPending = this.locale.values.filter((translation: Translation) => translation.isPending === true).length > 0;
      });
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
    update.branch = ProjectsService.workingVersionName(this.project);
    update.key = this.locale.getCompleteKey();
    update.value = {
      oldString: translation.string,
      newString: translation.editedString
    };

    this.projectsService
      .update(this.project.id, 'append-pendingChanges', [update])
      .then(updatedProject => {
        // Notify titlebar
        EventService.get('translations::updated-changes').emit(updatedProject.pendingChanges);

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