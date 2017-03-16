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

  @Output() toggleNewLocaleForm = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.isNewClicked = false;
    this.onStandardFAB();
  }

  onStandardFAB(): void {
    this.classname = (this.isNewClicked) ? 'rotate-45' : '';
  }

  onHoverFAB(): void {
    this.classname = (this.isNewClicked) ? 'rotate-225' : 'rotate-180';
  }

  onClickFAB(): void {
    this.classname = (this.isNewClicked) ? '' : 'rotate-225';
    this.isNewClicked = !this.isNewClicked;
    this.toggleNewLocaleForm.emit(this.isNewClicked);
  }
}