import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Project, LocaleFolder } from '../+models';
import { ProjectsService } from '../+services/projects.service';
import { TranslationsService } from '../+services/translations.service';
import { TRANSLATIONS_FR } from '../+mocks/translations-fr';
import { TRANSLATIONS_EN } from '../+mocks/translations-en';

@Component({
  moduleId: module.id,
  selector: 'lh-locales',
  templateUrl: 'list.component.html',
  styleUrls: [ 'list.component.css' ],
  providers: [ ProjectsService, TranslationsService ]
})
export class TranslationsListComponent implements OnInit {
  project: Project;
  projectOwner: string;
  projectRepo: string;
  // expandedNewTranslation: boolean;
  root: LocaleFolder;
  selected: LocaleFolder;

  constructor(
    private $route: ActivatedRoute,
    private projectsService: ProjectsService,
    private translationsService: TranslationsService
  ) { }

  ngOnInit() {
    this.project = new Project;

    this.$route.params.forEach((params: Params) => {
      this.projectOwner = params['projectOwner'];
      this.projectRepo = params['projectRepo'];

      this.projectsService
        .getProject(this.projectOwner, this.projectRepo)
        .then(project => this.project = project);
    });

    this.root = this.selected = this.translationsService.createList({
      "fr": TRANSLATIONS_FR,
      "en-US": TRANSLATIONS_EN,
      "jp" : {}
    });
  }

  onSelect(entry): void {
    this.selected = entry;
  }
}