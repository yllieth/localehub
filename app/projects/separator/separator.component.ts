import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'lh-projects-separator',
  templateUrl: 'separator.component.html',
  styleUrls: [ 'separator.component.css' ]
})
export class SeparatorComponent implements OnInit {
  private avatarUrl: string;
  private pseudo: string;
  private fullname: string;
  private isOrganization: boolean;

  // TODO: must be refactored
  constructor() {
    this.avatarUrl = 'https://avatars3.githubusercontent.com/u/1174557?v=3&s=466';
    this.pseudo = 'yllieth';
    this.fullname = 'Sylvain RAGOT';
    this.isOrganization = false;
  }

  ngOnInit() { }

}