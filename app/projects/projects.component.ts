import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { NewProjectDialog } from './new/dialog/new-project.component';

import { AuthenticationService, ErrorService, ProjectsService } from '../+services';
import { Project } from '../+models';

@Component({
  moduleId: module.id,
  selector: 'lh-projects',
  templateUrl: 'projects.component.html',
  styleUrls: [ 'projects.component.css' ],
  providers: [ ProjectsService ]
})
export class ProjectsComponent implements OnInit {
  projects: Project[];  // undefined value is tested in the template to show the loader

  constructor(
    private authenticationService: AuthenticationService,
    private projectsService: ProjectsService,
    private errorService: ErrorService,
    public dialog: MdDialog
  ) { }

  ngOnInit(): void {
    this.projects = [];
    this.authenticationService.initCurrentUser();
    this.projectsService.getProjects()
      .then(projectsList => (projectsList.length > 0) ? this.projects = projectsList : this.openNewProjectDialog())
      .catch(error => this.errorService.handleHttpError('404-001', error));
  }

  hasProjects(): boolean {
    return this.projects.length > 0;
  }

  openNewProjectDialog(): void {
    let newProjectDialog: MdDialogRef<NewProjectDialog>;
    let dialogConfig = new MdDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '70%';
    dialogConfig.height = '570px';

    newProjectDialog = this.dialog.open(NewProjectDialog, dialogConfig);
    newProjectDialog.componentInstance.existingProjects = this.projects.map(project => project.repository.fullName);

    newProjectDialog.afterClosed().subscribe((result: Project) => {
      newProjectDialog = null;

      if (result !== undefined) {
        this.projects.push(result);
      }
    });
  }

  onRemoveProject(removedProject: Project): void {
    this.projects = this.projects.filter(project => project.id !== removedProject.id);
    if (this.hasProjects() === false) {
      this.openNewProjectDialog();
    }
  }
}