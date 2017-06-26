import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Language, LocaleUpdate, Project, Translation } from '../../+models';
import { BranchesService, ErrorService, EventService, LanguageService, ProjectsService } from '../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-translations-preview',
  templateUrl: 'preview-dialog.component.html',
  styleUrls: [ 'preview-dialog.component.css' ],
  providers: [ ProjectsService ]
})
export class TranslationsPreviewDialog implements OnInit {
  project: Project;       // from TitleBarComponent.openPreviewDialog : translationsPreviewDialog.componentInstance.project = project;
  languages: Language[];  // list of unique languages contained in pendingChanges
  totalChanges: number;
  selectedBranch: string;
  changes;                // {'en-US': <LocaleUpdate[]>, ...} of pendingChanges
  files;                  // {'en-US': <I18nFileInfo>, ...} of pendingChanges
  isCommitting: boolean;
  isCreatingPR: boolean;

  constructor(
    private projectsService: ProjectsService,
    private errorService: ErrorService,
    public translationsPreviewDialog: MdDialogRef<TranslationsPreviewDialog>
  ) { }

  private initChanges(branch: string): void {
    this.selectedBranch = branch;
    this.languages = [];
    this.changes = {};
    this.files = {};
    this.totalChanges = 0;

    for (let change of this.project.pendingChanges) {
      if (change.branch === ProjectsService.workingVersionName(this.project)) {
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

  ngOnInit() {
    this.isCommitting = false;
    this.isCreatingPR = false;
    this.initChanges(ProjectsService.baseVersionName(this.project));
  }

  baseBranches(): string[] {
    return BranchesService.filterBaseBranches(this.project.availableBranches);
  }

  isEmpty(string: string): boolean {
    return string === undefined || string === null;
  }

  onUndo(change: LocaleUpdate) : void {
    this.projectsService
      .removeFromPendingChange(Translation.createFromLocaleUpdate(change), this.project)
      .then(updatedProject => {
        // Notify titlebar
        EventService.get('translations::updated-changes').emit(updatedProject.pendingChanges);

        this.project = updatedProject;
        this.initChanges(ProjectsService.workingVersionName(updatedProject));
      });
  }

  onChangeBranch(newBranch: string): void {
    this.initChanges(newBranch + BranchesService.APP_SUFFIX);
  }

  onCloseDialog(dialogRef: MdDialogRef<TranslationsPreviewDialog>): void {
    dialogRef.close();
  }

  onCommitChanges(): void {
    let payload = { branch: ProjectsService.workingVersionName(this.project) };
    this.isCommitting = true;

    this.projectsService
      .commit(this.project.id, payload)
      .then(pullRequest => {
        this.isCommitting = false;
        console.log(pullRequest);
      })
      .catch(error => {
        this.isCommitting = false;
        this.errorService.handleHttpError('500-001', error);
        this.onCloseDialog(this.translationsPreviewDialog);
      });
  }

  onCreatePR(): void {
    this.isCreatingPR = true;
  }
}
