import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { I18nFileInfo, Project } from '../../+models';
import { ErrorService, ProjectsService, RepositoriesService } from '../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-projects-card',
  templateUrl: 'projects-card.component.html',
  styleUrls: [ 'projects-card.component.css' ]
})
export class ProjectsCardComponent implements OnInit {
  @Input() project: Project;
  @Output() removedProject = new EventEmitter<Project>();
  isRefrechingBranches: boolean;
  isLoading: boolean;
  loadingMessage: string;

  constructor(
    private $router: Router,
    private repoService: RepositoriesService,
    private projectService: ProjectsService,
    private errorService: ErrorService
  ) { }

  ngOnInit() {
    this.isRefrechingBranches = false;
    this.isLoading = false;
  }

  onOpen(project: Project): void {
    this.$router.navigate(['/translations', project.id]);
  }

  maximumNumberOfTranslation(project: Project): number {
    let counts = project.i18nFiles.map((file: I18nFileInfo) => file.count);
    return Math.max(...counts);
  }

  ownerDetails(): string {
    let pseudo = this.project.repository.owner.login;
    let fullName = this.project.repository.owner.full_name;
        fullName = (fullName && fullName.length > 0 && fullName != pseudo)
          ? ' (' + this.project.repository.owner.full_name + ')'
          : '';

    return pseudo + fullName
  }

  refreshBranchList(): void {
    this.isRefrechingBranches = true;
    this.repoService
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

  deleteProject(): void {
    this.isLoading = true;
    this.loadingMessage = "Removing...";
    this.projectService
      .remove(this.project.id)
      .then((_) => this.removedProject.emit(this.project))
      .catch(error => this.errorService.handleHttpError("404-004", { name: this.project.name }));
  }
}