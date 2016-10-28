import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../projects/shared/project';

@Component({
  moduleId: module.id,
  selector: 'lh-titlebar',
  templateUrl: 'titlebar.component.html',
  styleUrls: [ 'titlebar.component.css' ]
})
export class TitlebarComponent implements OnInit {
  isProjectsList: boolean;
  isTranlationsList: boolean;

  @Input() project: Project;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.isProjectsList = false;
    this.isTranlationsList = false;
  }

  ngOnInit(): void {
    let routeName = this.route.routeConfig.path;
    // see app.routing.ts to the list of possible values

    this.isProjectsList = routeName === 'projects';
    this.isTranlationsList = routeName.indexOf('translations') === 0;
  }

  onClickProjects(): void {
    this.router.navigate(['/projects']);
  }

  onOpenBranchSwitcher(): void {}
  onFold(): void {}
  onDiff(): void {}
  onUnfold(): void {}
  onExport(): void {}
  onCommit(): void {}
}
