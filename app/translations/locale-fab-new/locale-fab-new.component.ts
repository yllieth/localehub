import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'lh-new-locale-fab',
  templateUrl: 'locale-fab-new.component.html',
  styleUrls: [ 'locale-fab-new.component.css' ]
})
export class LocaleFABNewComponent implements OnInit{
  state: string;  // { '', 'hovered', 'clicked' }
  isNewClicked: boolean;

  @Output() toggleNewLocaleForm = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.isNewClicked = false;
    this.onStandardFAB();
  }

  getRotation(state: string): string {
    if (state == 'hovered') {
      return (this.isNewClicked) ? 'rotate(225deg)' : 'rotate(180deg)';
    } else if (state == 'clicked') {
      return (this.isNewClicked) ? '' : 'rotate(225deg)';
    } else {
      return (this.isNewClicked) ? 'rotate(45deg)' : 'none';
    }
  }

  onStandardFAB(): void {
    this.state = '';
  }

  onHoverFAB(): void {
    this.state = 'hovered';
  }

  onClickFAB(): void {
    this.state = 'clicked';
    this.isNewClicked = !this.isNewClicked;
    this.toggleNewLocaleForm.emit(this.isNewClicked);
  }
}