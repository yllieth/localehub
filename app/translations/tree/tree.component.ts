import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LocaleFolder } from '../../+models';

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

  onToggleMenu(leaf: LocaleFolder): void {
    leaf.toggle();
  }

  onSelectMenu(leaf: LocaleFolder): void {
    this.select.emit(leaf);
  }
}