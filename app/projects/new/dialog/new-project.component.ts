import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from "@angular/material";
import { ApiService, CountryService, ErrorService, GithubService } from "../../../+services";
import { Country, GithubRepository, I18nFileInfo } from "../../../+models";

@Component({
  moduleId: module.id,
  selector: 'new-project-dialog',
  templateUrl: 'new-project.component.html',
  styleUrls: [ 'new-project.component.css' ]
})
export class NewProjectDialog implements OnInit {
  githubUsername: string;     // from ProjectsComponent.openNewProjectDialog : newProjectDialog.componentInstance.githubUser = user.login;
  githubUserUrl: string;      // from ProjectsComponent.openNewProjectDialog : newProjectDialog.componentInstance.githubUserUrl = user.url;
  existingProjects: string[]; // from ProjectsComponent.openNewProjectDialog : newProjectDialog.componentInstance.existingProjects = projects.map(project => project.name);
  selectedRepo: GithubRepository;
  repositoryList: GithubRepository[];
  branchList: string[];
  selectedBranch: string;
  languages: Country[];
  selectedLanguages: I18nFileInfo[];
  newFileLanguage: Country;
  newFilePath: string;
  parsingFile: {path: string, languageCode: string};
  isCreatingProject: boolean;
  showLanguageForm: boolean;
  isNewFileNotFound: boolean;
  isNewFileNotValid: boolean;

  constructor(
    private githubService: GithubService,
    private errorService: ErrorService,
    public newProjectDialog: MdDialogRef<NewProjectDialog>
  ) { }

  ngOnInit() {
    this.repositoryList = undefined;  // tested in the view to show the loader
    this.branchList = undefined;      // tested in the view to show the loader
    this.languages = CountryService.entireList();
    this.selectedLanguages = [];
    this.parsingFile = null;
    this.isCreatingProject = false;
    this.showLanguageForm = false;
    this.isNewFileNotFound = false;
    this.isNewFileNotValid = false;

    this.githubService
      .getRepositories(this.githubUsername)
      .then(repoList => this.repositoryList = repoList.filter((githubRepo: GithubRepository) => this.existingProjects.indexOf(githubRepo.name) === -1))
      /*.catch(error => this.errorService.handleHttpError('404-001', error))*/;
  }

  onSelectRepository(repository: GithubRepository) {
    this.selectedBranch = undefined;  // reset branch if the repo changes after selecting a branch for a previous one
    this.githubService
      .getBranches(this.githubUsername, repository.name)
      .then(branches => {
        this.branchList = branches;
        if (branches.indexOf('master') > -1) {
          this.selectedBranch = 'master';
        }
      });
  }

  onClickAddLanguage(languageCode, path): void {
    this.parsingFile = {path, languageCode};
    this.resetNewFileErrors();
    this.githubService
      .checkI18nfile(this.githubUsername, this.selectedRepo.name, path, languageCode)
      .then(fileInfo => {
        this.selectedLanguages.push(fileInfo);
        this.parsingFile = null;
        this.newFileLanguage = undefined;
        this.newFilePath = undefined;
      })
      .catch(error => {
        this.isNewFileNotFound = error.status === 404;
        this.isNewFileNotValid = error.status === 422;
        this.parsingFile = null;
      });
  }

  resetNewFileErrors(): void {
    this.isNewFileNotValid = false;
    this.isNewFileNotFound = false;
  }

  onClickResetLanguage(): void {
    this.newFileLanguage = undefined;
    this.newFilePath = undefined;
    this.showLanguageForm = false;
  }

  countryOf(languageCode: string): Country {
    return CountryService.find(languageCode);
  }

  isSaveDisabled(): boolean {
    return this.selectedRepo === undefined || this.selectedBranch === undefined || this.selectedLanguages.length === 0;
  }

  isAddLanguageDisabled(): boolean {
    return this.newFileLanguage === undefined || this.newFilePath === undefined;
  }

  createProject(dialogRef: MdDialogRef<NewProjectDialog>): void {
    let payload = {
      id: ApiService.generateUUID(),
      name: this.selectedRepo.name,
      owner: this.selectedRepo.owner.url,
      user: this.githubUserUrl,
      availableBranches: this.branchList,
      lastActiveBranch: this.selectedBranch,
      i18nFiles: this.selectedLanguages
    };

    this.isCreatingProject = true;
    this.githubService
      .createProject(payload)
      .then(project => {
        this.isCreatingProject = false;
        dialogRef.close(project);
      });
  }
}