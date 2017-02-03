import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Project } from '../../+models';

@Component({
  moduleId: module.id,
  selector: 'lh-translations-preview',
  templateUrl: 'preview-dialog.component.html',
  styleUrls: [ 'preview-dialog.component.css' ]
})
export class TranslationsPreviewDialog implements OnInit {
  project: Project; // from TitleBarComponent.openPreviewDialog : translationsPreviewDialog.componentInstance.project = project;

  constructor(
    public translationsPreviewDialog: MdDialogRef<TranslationsPreviewDialog>
  ) { }

  ngOnInit() {

  }
}
