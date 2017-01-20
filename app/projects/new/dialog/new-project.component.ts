import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from "@angular/material";
import { ErrorService, FlagService, GithubService } from "../../../+services";
import { GithubRepository, I18nFileInfo } from "../../../+models";

@Component({
  moduleId: module.id,
  selector: 'new-project-dialog',
  templateUrl: 'new-project.component.html',
  styleUrls: [ 'new-project.component.css' ]
})
export class NewProjectDialog implements OnInit {
  githubUsername: string; // from ProjectsComponent.openNewProjectDialog : newProjectDialog.componentInstance.githubUser = username;
  githubUserUrl: string;  // from ProjectsComponent.openNewProjectDialog : newProjectDialog.componentInstance.githubUserUrl = userUrl;
  selectedRepo: GithubRepository;
  repositoryList: GithubRepository[];
  branchList: string[];
  selectedBranch: string;
  languages: {languageName: string, languageCode: string, flagClass: string}[];
  selectedLanguages: I18nFileInfo[];
  newFileLanguage: {languageName: string, languageCode: string, flagClass: string};
  newFilePath: string;
  parsingFile: {path: string, languageCode: string};

  constructor(
    private githubService: GithubService,
    private errorService: ErrorService,
    public newProjectDialog: MdDialogRef<NewProjectDialog>
  ) { }

  ngOnInit() {
    let fake = new GithubRepository();
    fake.name = 'Loading...';
    this.repositoryList = [fake];
    this.languages = FlagService.getCountriesList();
    this.selectedLanguages = [];
    this.parsingFile = null;

    this.githubService
      .getRepositories(this.githubUsername)
      .then(repoList => this.repositoryList = repoList)
      /*.catch(error => this.errorService.handleHttpError('404-001', error))*/;
  }

  onSelectRepository(repository: GithubRepository) {
    this.branchList = ['Loading...'];
    this.selectedBranch = undefined;
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
    this.githubService
      .checkI18nfile(this.githubUsername, this.selectedRepo.name, path, languageCode)
      .then(fileInfo => {
        this.selectedLanguages.push(fileInfo);
        this.parsingFile = null;
        this.newFileLanguage = null;
        this.newFilePath = null;
      });
  }

  flagOf(countryCode: string): string {
    return FlagService.getClassName(countryCode);
  }

  languageName(countryCode: string): string {
    return FlagService.getLanguageName(countryCode);
  }

  isSaveDisabled(): boolean {
    return this.selectedRepo === undefined || this.selectedBranch === undefined || this.selectedLanguages.length === 0;
  }
}