import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Language, LocaleUpdate, Project } from '../../+models';
import { LanguageService } from '../../+services';


@Component({
  moduleId: module.id,
  selector: 'lh-translations-preview',
  templateUrl: 'preview-dialog.component.html',
  styleUrls: [ 'preview-dialog.component.css' ]
})
export class TranslationsPreviewDialog implements OnInit {
  project: Project;       // from TitleBarComponent.openPreviewDialog : translationsPreviewDialog.componentInstance.project = project;
  languages: Language[];  // list of unique languages contained in pendingChanges
  totalChanges: number;
  changes;                // {'en-US': <LocaleUpdate[]>, ...} of pendingChanges
  files;                  // {'en-US': <I18nFileInfo>, ...} of pendingChanges

  constructor(
    public translationsPreviewDialog: MdDialogRef<TranslationsPreviewDialog>
  ) { }

  ngOnInit() {
    this.languages = [];
    this.changes = {};
    this.files = {};
    this.totalChanges = 0;

    for (let change of this.project.pendingChanges) {
      if (change.branch === this.project.lastActiveBranch) {
        this.totalChanges++;

        // build languages array
        if (this.languages.filter(language => language.languageCode === change.languageCode).length <= 0) {
          this.languages.push(LanguageService.find(change.languageCode));
        }

        // build changes object
        if (this.changes.hasOwnProperty(change.languageCode) === true) {
          this.changes[change.languageCode].push(change);
        } else {
          this.changes[change.languageCode] = [change];
        }

        // build files object
        this.files[change.languageCode] = this.project.i18nFiles.filter(file => file.languageCode === change.languageCode)[0];
      }
    }
  }
}
