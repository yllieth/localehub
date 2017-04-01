import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Project, Language, LocaleFolder } from '../+models';
import { AuthenticationService, BranchesService, LanguageService, ProjectsService, TranslationsService } from '../+services';

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
  newLocaleFormVisible: boolean;
  branch: {created: boolean, from: string, to: string};

  constructor(
    private $route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private branchService: BranchesService,
    private projectsService: ProjectsService,
    private translationsService: TranslationsService
  ) { }

  ngOnInit() {
    this.authenticationService.initCurrentUser();
    this.newLocaleFormVisible = false;
    this.$route.params.subscribe((params: Params) => {
      this.projectsService
        .getOne(params['projectId'])
        .then(project => this.projectsService.updateBranchList(project))
        .then(project => {
          this.project = project;
          let from = ProjectsService.baseVersionName(project);
          let to = ProjectsService.workingVersionName(project);
          if (ProjectsService.needsToCreateWorkingVersion(project)) {
            return this.branchService.create(this.project.repository.fullName, from, to)
              .then((_) => { return {created: true, from, to};});
          } else {
            return Promise.resolve({created: false, from, to});
          }
        })
        .then(branch => {
          this.branch = branch;
          return this.translationsService.getDictionaries(this.project.id, this.project.i18nFiles, branch.to);
        })
        .then(dictionaries => {
          let newEntries = ProjectsService.getNewEntries(this.project);
          this.root = this.selected = this.translationsService.createList(dictionaries, newEntries);
        });
    });
  }

  onSelect(entry: LocaleFolder): void {
    this.selected = entry;
  }

  onToggleNewLocaleForm(newLocaleFormVisible: boolean): void {
    this.newLocaleFormVisible = newLocaleFormVisible;
  }

  supportedLanguages(project: Project): Language[] {
    let languages = [];
    for (let file of project.i18nFiles) {
      languages.push(LanguageService.find(file.languageCode));
    }

    return languages;
  }

  newLocalePath(): string[] {
    return this.selected.path.split('.');
  }

  countryOf(languageCode: string): Language {
    return LanguageService.find(languageCode);
  }
}