import { Component, OnInit, Input } from '@angular/core';
import { Locale } from '../../../+models/locale';

@Component({
  moduleId: module.id,
  selector: 'lh-locale',
  templateUrl: 'locale.component.html',
  styleUrls: [ 'locale.component.css' ]
})
export class TranslationsLocaleComponent implements OnInit {
  @Input() locale: Locale;

  constructor() { }

  ngOnInit() { }
}