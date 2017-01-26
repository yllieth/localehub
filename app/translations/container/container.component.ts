import { Component, Input } from '@angular/core';
import { LocaleFolder, Project } from '../../+models';

@Component({
  moduleId: module.id,
  selector: 'lh-translations-container',
  templateUrl: 'container.component.html',
  styleUrls: [ 'container.component.css' ]
})
export class TranslationsContainerComponent {
  @Input() selected: LocaleFolder;
  @Input() project: Project;  // transmitted to locale.component

  constructor() { }
}