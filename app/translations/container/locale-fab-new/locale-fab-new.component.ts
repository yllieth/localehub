import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'lh-new-locale-fab',
  templateUrl: 'locale-fab-new.component.html',
  styleUrls: [ 'locale-fab-new.component.css' ]
})
export class LocaleFABNewComponent implements OnInit{
  classname: string;

  constructor() { }

  ngOnInit() {
    this.onStandardFAB();
  }

  onStandardFAB(): void {
    this.classname = '';
  }

  onHoverFAB(): void {
    this.classname = 'rotate-180';
  }

  onClickFAB(): void {
    this.classname = 'rotate-45'
  }
}