import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Project, Language, LocaleFolder } from '../+models';
import { AuthenticationService, LanguageService, ProjectsService, TranslationsService } from '../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-locales',
  templateUrl: 'list.component.html',
  styleUrls: [ 'list.component.css' ],
  providers: [ ProjectsService, TranslationsService ]
})
export class TranslationsListComponent implements OnInit {
  project: Project;       // undefined value is tested in the template to show the loader
  root: LocaleFolder;     // undefined value is tested in the template to show the loader
  selected: LocaleFolder; // undefined value is tested in the template to show the loader
  showNewLocaleForm: boolean;

  constructor(
    private $route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private projectsService: ProjectsService,
    private translationsService: TranslationsService
  ) { }

  ngOnInit() {
    this.authenticationService.initCurrentUser();
    this.showNewLocaleForm = false;
    this.$route.params.forEach((params: Params) => {
      this.projectsService
        .getOne(params['projectId'])
        .then(project => this.project = project)
        .then((_) => this.translationsService
          .getDictionaries(this.project)
          .then(dictionaries => this.root = this.selected = this.translationsService.createList(dictionaries))
          .catch(error => /* TODO improve error handling */ console.log('Error while fetching translations', error)))
        .catch(error => /* TODO improve error handling */ console.log('Error while fetching projects', error));
    });
  }

  onSelect(entry): void {
    this.selected = entry;
  }

  onShowNewLocaleForm(showNewLocaleForm: boolean): void {
    this.showNewLocaleForm = showNewLocaleForm;
  }

  countryOf(languageCode: string): Language {
    return LanguageService.find(languageCode);
  }
}