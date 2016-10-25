import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service'
import { Group } from './shared/group';

@Component({
  moduleId: module.id,
  selector: 'lh-projects',
  templateUrl: 'projects.component.html',
  styleUrls: [ 'projects.component.css' ],
  providers: [ ProjectsService ]
})
export class ProjectsComponent implements OnInit {
  projectsList: Group[];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.getProjectList().then(projectsList => this.projectsList = projectsList);
  }

  toggle(group: Group): void {
    group.expanded = !group.expanded;
  }
}