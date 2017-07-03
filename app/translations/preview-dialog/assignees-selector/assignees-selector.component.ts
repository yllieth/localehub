import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RepositoriesService } from '../../../+services';
import { Contributor } from "../../../+models";

@Component({
  moduleId: module.id,
  selector: 'lh-assignees-selector',
  templateUrl: 'assignees-selector.component.html',
  styleUrls: [ 'assignees-selector.component.css' ],
  providers: [RepositoriesService]
})
export class AssigneesSelectorComponent implements OnInit {
  @Input() owner: string;
  @Input() repo: string;
  @Output() assigneesSelected = new EventEmitter<Contributor[]>();
  @Output() assigneesCanceled = new EventEmitter<null>();
  isLoading: boolean;
  contributors: Contributor[];

  constructor(private repositoriesService: RepositoriesService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.repositoriesService
      .getContributors(this.owner, this.repo)
      .then(contributors => {
        this.isLoading = false;
        this.contributors = contributors;
      });
  }

  hasAssignee() : boolean {
    return (this.contributors)
      ? this.contributors.filter(contributor => contributor.$selected === true).length > 0
      : false;
  }

  onToggleSelection(selectedContributor: Contributor) : void {
    this.contributors.map(contributor => {
      if (contributor.id === selectedContributor.id) {
        contributor.$selected = !contributor.$selected;
      }
    });
  }

  onDone() : void {
    this.assigneesSelected.emit(this.contributors.filter(contributor => contributor.$selected === true));
  }

  onCancel() : void {
    this.assigneesCanceled.emit();
  }
}