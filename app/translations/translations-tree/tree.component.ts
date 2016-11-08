import { Component, OnInit, Input } from '@angular/core';
import { LocaleFolder } from '../../+models/locale-folder';

@Component({
  moduleId: module.id,
  selector: 'lh-translations-tree',
  templateUrl: 'tree.component.html',
  styleUrls: [ 'tree.component.css' ]
})
export class TranslationsTreeComponent implements OnInit {
  @Input() leaf: LocaleFolder;

  constructor() { }

  ngOnInit() { }

  onClickMenu(leaf: LocaleFolder): void {
    leaf.expanded = !leaf.expanded;
  }
}