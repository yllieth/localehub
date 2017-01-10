import { Component, OnInit } from '@angular/core';
import {MdDialogRef, MdDialog, MdDialogConfig} from "@angular/material";
import { ProjectsService, ErrorService } from '../+services';
import { Group } from '../+models';
import { NewProjectDialog } from "./new/dialog/new-project.component";

@Component({
  moduleId: module.id,
  selector: 'lh-projects',
  templateUrl: 'projects.component.html',
  styleUrls: [ 'projects.component.css' ],
  providers: [ ProjectsService ]
})
export class ProjectsComponent implements OnInit {
  projectsList: Group[];

  constructor(
    private projectsService: ProjectsService,
    private errorService: ErrorService,
    public dialog: MdDialog
  ) { }

  ngOnInit(): void {
    this.projectsService.getProjectList()
      .then(projectsList => this.projectsList = projectsList)
      .catch(error => this.errorService.handleHttpError('404-001', error));
  }

  toggle(group: Group): void {
    group.expanded = !group.expanded;
  }

  openNewProjectDialog(username, userUrl): void {
    let newProjectDialog: MdDialogRef<NewProjectDialog>;
    let dialogConfig = new MdDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';

    newProjectDialog = this.dialog.open(NewProjectDialog, dialogConfig);
    newProjectDialog.componentInstance.githubUsername = username;
    newProjectDialog.componentInstance.githubUserUrl = userUrl;

    newProjectDialog.afterClosed().subscribe(result => {
      console.log('result: ' + result);
      newProjectDialog = null;
    });
  }
}