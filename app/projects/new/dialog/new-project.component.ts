import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from "@angular/material";

@Component({
  moduleId: module.id,
  selector: 'new-project-dialog',
  templateUrl: 'new-project.component.html',
  styleUrls: [ 'new-project.component.css' ]
})
export class NewProjectDialog implements OnInit {
  githubUsername: string; // from ProjectsComponent.openNewProjectDialog : newProjectDialog.componentInstance.githubUser = username;
  githubUserUrl: string;
  selectedRepo: string;
  repositoryList: string[];

  constructor(public newProjectDialog: MdDialogRef<NewProjectDialog>) { }

  ngOnInit() {
    this.repositoryList = ['Loading...'];
  }
}