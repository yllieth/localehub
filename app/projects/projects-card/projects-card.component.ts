import { Component, OnInit, Input } from '@angular/core';
import { Project } from "../shared/project";

@Component({
  moduleId: module.id,
  selector: 'lh-projects-card',
  templateUrl: 'projects-card.component.html',
  styleUrls: [ 'projects-card.component.css' ]
})
export class ProjectsCardComponent implements OnInit {
  @Input()
  project: Project;

  constructor() { }

  ngOnInit() { }

}