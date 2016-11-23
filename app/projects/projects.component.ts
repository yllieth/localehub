import { Component, OnInit } from '@angular/core';
import { ProjectsService, ErrorService } from '../+services';
import { Group } from '../+models';

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
  ) { }

  ngOnInit(): void {
    this.projectsService.getProjectList()
      .then(projectsList => this.projectsList = projectsList)
      .catch((_) => this.errorService.handleHttpError('404-001'));
  }

  toggle(group: Group): void {
    group.expanded = !group.expanded;
  }
}