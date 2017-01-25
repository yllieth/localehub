import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { I18nFileInfo, Project } from '../../+models';
import { ErrorService, GithubService } from '../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-projects-card',
  templateUrl: 'projects-card.component.html',
  styleUrls: [ 'projects-card.component.css' ]
})
export class ProjectsCardComponent implements OnInit {
  @Input() project: Project;
  isRefrechingBranches: boolean;

  constructor(
    private $router: Router,
    private githubService: GithubService,
    private errorService: ErrorService
  ) { }

  ngOnInit() {
    this.isRefrechingBranches = false;
  }

  onOpen(project: Project): void {
    this.$router.navigate(['/translations', project.id]);
  }

  maximumNumberOfTranslation(project: Project): number {
    let counts = project.i18nFiles.map((file: I18nFileInfo) => file.count);
    return Math.max(...counts);
  }

  refreshBranchList(): void {
    this.isRefrechingBranches = true;
    this.githubService
      .getBranches(this.project.repository.fullName)
      .then((branches: string[]) => {
        this.isRefrechingBranches = false;

        if (branches.indexOf(this.project.lastActiveBranch) > -1) {
          this.project.availableBranches = branches;
        } else {
          this.errorService.handleHttpError("404-002", { lastActiveBranch: this.project.lastActiveBranch, updatedBranchlist: branches.join(', ') });
        }
      })
      .catch((_) => this.errorService.handleHttpError("404-003", { repo: this.project.repository.fullName }));
  }
}