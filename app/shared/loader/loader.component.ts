import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'lh-loader',
  templateUrl: 'loader.component.html',
  styleUrls: [ 'loader.component.css' ]
})
export class LoaderComponent {
  @Input() message: string;

  constructor() { }
}