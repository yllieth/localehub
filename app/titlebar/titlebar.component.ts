import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

import { Project } from '../+models';
import { EventService } from '../+services';
import { TranslationsPreviewDialog } from '../translations/preview-dialog/preview-dialog.component';

@Component({
  moduleId: module.id,
  selector: 'lh-titlebar',
  templateUrl: 'titlebar.component.html',
  styleUrls: [ 'titlebar.component.css' ]
})
export class TitlebarComponent implements OnInit {
  isProjectsList: boolean;
  isTranlationsList: boolean;

  @Input() project: Project;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MdDialog
  ) {
    this.isProjectsList = false;
    this.isTranlationsList = false;
  }

  ngOnInit(): void {
    let routeName = this.route.routeConfig.path;
    // see app.routing.ts to the list of possible values

    this.isProjectsList = routeName === 'projects';
    this.isTranlationsList = routeName.indexOf('translations') === 0;

    // Listen for new changes to update pending changes status
    EventService
      .get('translations::updated-changes')
      .subscribe(changes => {
        this.project.pendingChanges = changes
      });
  }

  isSaveDisabled(): boolean {
    return this.project.pendingChanges.length <= 0;
  }

  onClickProjects(): void {
    this.router.navigate(['/projects']);
  }

  onFold(): void {
    EventService.get('titlebar::expand-locales').emit(false);
  }

  onUnfold(): void {
    EventService.get('titlebar::expand-locales').emit(true);
  }

  onCommit(): void {
    let translationsPreviewDialog: MdDialogRef<TranslationsPreviewDialog>;
    let dialogConfig = new MdDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '70%';
    dialogConfig.height = '570px';

    translationsPreviewDialog = this.dialog.open(TranslationsPreviewDialog, dialogConfig);
    translationsPreviewDialog.componentInstance.project = this.project;

    translationsPreviewDialog.afterClosed().subscribe((result: Project) => {
      translationsPreviewDialog = null;
      console.log(result);
    });
  }

  onOpenBranchSwitcher(): void {}
  onExport(): void {}
}
