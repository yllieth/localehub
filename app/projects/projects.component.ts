import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../+services/projects.service'
import { Group } from '../+models/group';
import { ErrorService } from '../+services/error.service';

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
      .catch(error => this.errorService.handleHttpError('404-001', error));
  }

  toggle(group: Group): void {
    group.expanded = !group.expanded;
  }
}