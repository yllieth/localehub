import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'lh-locales',
  templateUrl: 'locales.component.html'
})
export class LocalesComponent implements OnInit {
  projectOwner: string;
  projectRepo: string;
  expandedNewTranslation: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.projectOwner = params['projectOwner'];
      this.projectRepo = params['projectRepo'];
    });
  }
}