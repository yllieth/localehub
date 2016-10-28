import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Project } from '../projects/shared/project';
import { ProjectsService } from '../projects/projects.service';

@Component({
  moduleId: module.id,
  selector: 'lh-locales',
  templateUrl: 'list.component.html',
  providers: [ ProjectsService ]
})
export class TranslationsListComponent implements OnInit {
  project: Project;
  projectOwner: string;
  projectRepo: string;
  expandedNewTranslation: boolean;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.project = new Project;

    this.route.params.forEach((params: Params) => {
      this.projectOwner = params['projectOwner'];
      this.projectRepo = params['projectRepo'];

      this.projectsService
        .getProject(this.projectOwner, this.projectRepo)
        .then(project => this.project = project);
    });
  }
}