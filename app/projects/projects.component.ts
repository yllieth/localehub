import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";
import { ProjectsService, ErrorService } from '../+services';
import { Group, Project, User } from '../+models';
import { NewProjectDialog } from "./new/dialog/new-project.component";
import {AuthenticationService} from "../+services/authentication.service";

@Component({
  moduleId: module.id,
  selector: 'lh-projects',
  templateUrl: 'projects.component.html',
  styleUrls: [ 'projects.component.css' ],
  providers: [ ProjectsService ]
})
export class ProjectsComponent implements OnInit {
  projectsList: Group[];  // undefined value is tested in the template to show the loader

  constructor(
    private authenticationService: AuthenticationService,
    private projectsService: ProjectsService,
    private errorService: ErrorService,
    public dialog: MdDialog
  ) { }

  ngOnInit(): void {
    this.authenticationService.initCurrentUser();
    this.projectsService.getProjectList()
      .then(projectsList => this.projectsList = projectsList)
      .catch(error => this.errorService.handleHttpError('404-001', error));
  }

  toggle(group: Group): void {
    group.expanded = !group.expanded;
  }

  openNewProjectDialog(user: User, projects: Project[]): void {
    let newProjectDialog: MdDialogRef<NewProjectDialog>;
    let dialogConfig = new MdDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';

    newProjectDialog = this.dialog.open(NewProjectDialog, dialogConfig);
    newProjectDialog.componentInstance.githubUsername = user.login;
    newProjectDialog.componentInstance.githubUserUrl = user.url;
    newProjectDialog.componentInstance.existingProjects = projects.map(project => project.name);

    newProjectDialog.afterClosed().subscribe((result: Project) => {
      newProjectDialog = null;

      if (result !== undefined) {
        this.projectsList.map(function (group) {
          if (group.user.login === user.login) {
            group.projects.push(result);
          }
        });
      }
    });
  }
}