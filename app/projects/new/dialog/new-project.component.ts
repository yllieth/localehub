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
  languages: {languageName: string, languageCode: string, flagClass: string}[];
  selectedLanguages: I18nFileInfo[];

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

    this.githubService
      .getRepositories(this.githubUsername)
      .then(repoList => this.repositoryList = repoList)
      /*.catch(error => this.errorService.handleHttpError('404-001', error))*/;
  }

  onClickRepo(repository: GithubRepository): void {
    this.selectedRepo = repository;
  }

  onClickAddLanguage(): void {

  }

  isSaveDisabled(): boolean {
    return this.selectedRepo === undefined || this.selectedLanguages.length === 0;
  }
}