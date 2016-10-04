import { Component, OnInit } from '@angular/core';
import {ProjectsService} from "./projects.service";
import {Member} from "./shared/member";

@Component({
  moduleId: module.id,
  selector: 'lh-projects',
  templateUrl: 'projects.component.html',
  styleUrls: [ 'projects.component.css' ],
  providers: [ ProjectsService ]
})
export class ProjectsComponent implements OnInit {
  projectsList: Member[];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.getProjectList().then(projectsList => this.projectsList = projectsList);
  }
}