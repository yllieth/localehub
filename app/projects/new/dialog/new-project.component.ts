import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from "@angular/material";
import { GithubService, ErrorService } from "../../../+services";
import { GithubRepository } from "../../../+models";

@Component({
  moduleId: module.id,
  selector: 'new-project-dialog',
  templateUrl: 'new-project.component.html',
  styleUrls: [ 'new-project.component.css' ]
})
export class NewProjectDialog implements OnInit {
  githubUsername: string; // from ProjectsComponent.openNewProjectDialog : newProjectDialog.componentInstance.githubUser = username;
  githubUserUrl: string;
  selectedRepo: GithubRepository;
  repositoryList: GithubRepository[];

  constructor(
    private githubService: GithubService,
    private errorService: ErrorService,
    public newProjectDialog: MdDialogRef<NewProjectDialog>
  ) { }

  ngOnInit() {
    let fake = new GithubRepository();
    fake.name = 'Loading...';
    this.repositoryList = [fake];

    this.githubService
      .getRepositories(this.githubUsername)
      .then(repoList => this.repositoryList = repoList)
      /*.catch(error => this.errorService.handleHttpError('404-001', error))*/;
  }

  onClickRepo(repository: GithubRepository): void {
    this.selectedRepo = repository;
  }

  isSaveDisabled(): boolean {
    return this.selectedRepo === undefined;
  }
}