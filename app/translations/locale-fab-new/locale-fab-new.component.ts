import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'lh-new-locale-fab',
  templateUrl: 'locale-fab-new.component.html',
  styleUrls: [ 'locale-fab-new.component.css' ]
})
export class LocaleFABNewComponent implements OnInit{
  classname: string;
  isNewClicked: boolean;

  @Output() showNewLocaleForm = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.isNewClicked = false;
    this.onStandardFAB();
  }

  onStandardFAB(): void {
    this.classname = '';
  }

  onHoverFAB(): void {
    this.classname = 'rotate-180';
  }

  onClickFAB(): void {
    this.classname = 'rotate-45';
    this.isNewClicked = !this.isNewClicked;
    this.showNewLocaleForm.emit(this.isNewClicked);
  }
}