import { Component, Input } from '@angular/core';
import { Group } from '../../+models/group';

@Component({
  moduleId: module.id,
  selector: 'lh-projects-separator',
  templateUrl: 'separator.component.html',
  styleUrls: [ 'separator.component.css' ]
})
export class SeparatorComponent {
  @Input() group: Group;
}