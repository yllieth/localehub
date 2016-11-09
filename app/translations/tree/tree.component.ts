import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LocaleFolder } from '../../+models/locale-folder';

@Component({
  moduleId: module.id,
  selector: 'lh-translations-tree',
  templateUrl: 'tree.component.html',
  styleUrls: [ 'tree.component.css' ]
})
export class TranslationsTreeComponent implements OnInit {
  @Input() leaf: LocaleFolder;
  @Input() selected: LocaleFolder;
  @Output() select = new EventEmitter<LocaleFolder>();

  constructor() { }

  ngOnInit() { }

  onClickMenu(leaf: LocaleFolder): void {
    leaf.toggle();
    this.select.emit(leaf);
  }

  onSelect(leaf: LocaleFolder): void {
    // required to handle the recursivity of the tree component!
    this.select.emit(leaf);
  }
}