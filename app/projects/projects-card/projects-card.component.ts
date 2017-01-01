import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../+models';

@Component({
  moduleId: module.id,
  selector: 'lh-projects-card',
  templateUrl: 'projects-card.component.html',
  styleUrls: [ 'projects-card.component.css' ]
})
export class ProjectsCardComponent implements OnInit {
  @Input()
  project: Project;

  constructor(private router: Router) { }

  ngOnInit() { }

  onOpen(projectOwnerUrl: string, projectRepo: string): void {
    let owner = projectOwnerUrl.split('/').pop();

    this.router.navigate(['/translations', owner, projectRepo]);
  }
}