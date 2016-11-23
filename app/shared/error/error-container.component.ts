import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ErrorService } from '../../+services';
import { ApplicationError } from '../../+models';

@Component({
  moduleId: module.id,
  selector: 'lh-error-container',
  templateUrl: 'error-container.component.html',
  styleUrls: [ 'error-container.component.css' ],
})
export class ErrorContainerComponent implements OnInit {
  error: ApplicationError;
  detailed: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.error = ErrorService.init(params['errorId']);
    });
  }

  // onOpenDetails(): void {
  //   this.detailed = !this.detailed;
  // }
}