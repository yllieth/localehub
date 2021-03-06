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
  @Input() noMarginTop: boolean;
  isSavingTranslation: boolean;
  isPending: boolean;

  private handlePendingChanges(pendingChanges: LocaleUpdate[], markAsPendingChange: boolean): void {
    // add/highlight pending changes
    for(let change of pendingChanges) {
      if (change.key === this.locale.getCompleteKey() && change.branch === ProjectsService.workingVersionName(this.project)) {
        this.isPending = markAsPendingChange;
        this.locale.values.map((value: Translation) => {
          if (change.languageCode === value.language.languageCode) {
            value.$originalString = change.value.oldString;
            value.string = change.value.newString;
            value.isPending = markAsPendingChange;
          }
        });
      }
    }
  }

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    this.locale.expand(false);
    this.isSavingTranslation = false;
    this.handlePendingChanges(this.project.pendingChanges, true);

    EventService
      .get('titlebar::expand-locales')
      .subscribe(value => this.locale.expand(value));

    EventService
      .get('translations::updated-changes')
      .subscribe((pendingChanges: LocaleUpdate[]) => this.handlePendingChanges(pendingChanges, true));

    EventService
      .get('translations::undo-change')
      .subscribe((change: LocaleUpdate) => this.handlePendingChanges([change], false));
  }

  edit(translation: Translation): void {
    if (this.isSavingTranslation === false) {
      translation.editedString = translation.string;
    }
  }

  undo(translation: Translation): void {
    translation.$isProcessing = true;

    this.projectsService
      .removeFromPendingChange(translation, this.project)
      .then(updatedProject => {
        // Notify titlebar
        EventService.get('translations::updated-changes').emit(updatedProject.pendingChanges);

        translation.$isProcessing = false;
        this.project = updatedProject;
        this.locale.values.map((value: Translation) => {
          if (value.language.languageCode === translation.language.languageCode) {
            value.editedString = null;
            value.string = translation.$originalString;
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