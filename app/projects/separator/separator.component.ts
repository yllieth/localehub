import { Component, OnInit, Input } from '@angular/core';
import {Member} from "../shared/member";

@Component({
  moduleId: module.id,
  selector: 'lh-projects-separator',
  templateUrl: 'separator.component.html',
  styleUrls: [ 'separator.component.css' ]
})
export class SeparatorComponent implements OnInit {
  @Input()
  member: Member;

  constructor() { }

  ngOnInit() { }

}