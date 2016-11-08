import { Component, OnInit, Input } from '@angular/core';
import { LocaleFolder } from '../../+models/locale-folder';

@Component({
  moduleId: module.id,
  selector: 'lh-translations-menu',
  templateUrl: 'menu.component.html',
  styleUrls: [ 'menu.component.css' ]
})
export class TranslationsMenuComponent implements OnInit {
  @Input() translations: LocaleFolder;

  constructor() { }

  ngOnInit() { }
}