import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdSelectChange } from '@angular/material';
import { AuthenticationService, BranchesService, ErrorService, LanguageService, ProjectsService, RepositoriesService, TranslationsService, UserService } from '../../../+services';
import { Repository, I18nFileInfo, Language, User } from '../../../+models';

@Component({
  moduleId: module.id,
  selector: 'new-project-dialog',
  templateUrl: 'new-project.component.html',
  styleUrls: [ 'new-project.component.css' ],
  providers: [ BranchesService, ProjectsService, RepositoriesService, TranslationsService ]
})
export class NewProjectDialog implements OnInit {
  existingProjects: string[]; // from ProjectsComponent.openNewProjectDialog : newProjectDialog.componentInstance.existingProjects = projects.map(project => project.name);
  selectedUser: User;
  otherUsers: User[];
  showOtherUsers: boolean;
  selectedRepo: Repository;
  repositoryList: Repository[];
  branchList: string[];
  selectedBranch: string;
  languages: Language[];
  selectedLanguages: I18nFileInfo[];
  newFileLanguage: Language;
  newFilePath: string;
  parsingFile: {path: string, languageCode: string};
  isCreatingProject: boolean;
  showLanguageForm: boolean;
  isNewFileNotFound: boolean;
  isNewFileNotValid: boolean;

  constructor(
    private userService: UserService,
    private repoService: RepositoriesService,
    private branchesService: BranchesService,
    private errorService: ErrorService,
    private authenticationService: AuthenticationService,
    private projectService: ProjectsService,
    private translationsService: TranslationsService,
    public newProjectDialog: MdDialogRef<NewProjectDialog>
  ) { }

  private loadRepositories(selectedUser: User): void {
    this.repositoryList = undefined;  // tested in the view to show the loader
    this.selectedRepo = undefined;
    this.repoService
      .getAll(selectedUser.login)
      .then(repositories => this.repositoryList = repositories);
  }

  private loadOtherUsers(selectedUser: User): void {
    this.userService
      .getOrganizations()
      .then((users: User[]) => this.otherUsers = users.filter(user => user.id != selectedUser.id));
  }

  ngOnInit() {
    this.branchList = undefined;      // tested in the view to show the loader
    this.languages = LanguageService.entireList();
    this.selectedLanguages = [];
    this.parsingFile = null;
    this.isCreatingProject = false;
    this.showOtherUsers = false;
    this.showLanguageForm = false;
    this.isNewFileNotFound = false;
    this.isNewFileNotValid = false;

    this.authenticationService
      .initCurrentUser()
      .then((user: User) => {
        this.selectedUser = user;
        this.loadRepositories(user);
        this.loadOtherUsers(user);
      })
      /*.catch(error => this.errorService.handleHttpError('404-001', error))*/;
  }

  hasProject(repository: Repository): boolean {
    return this.existingProjects.indexOf(repository.fullName) >= 0;
  }

  onSelectRepository(event: MdSelectChange) {
    this.selectedRepo = event.value;
    this.branchList = undefined;      // tested in the view to show the loader
    this.selectedBranch = undefined;  // reset branch if the repo changes after selecting a branch for a previous one
    this.branchesService
      .getNames(this.selectedRepo.fullName)
      .then(branches => {
        this.branchList = branches;
        if (branches.indexOf('master') > -1) {
          this.selectedBranch = 'master';
        }
      });
  }

  onClickAddLanguage(languageCode, path): void {
    this.parsingFile = {path, languageCode};
    this.resetNewFileErrors();
    this.translationsService
      .checkI18nfile(this.selectedRepo.fullName, path, languageCode, this.selectedBranch)
      .then(fileInfo => {
        this.selectedLanguages.push(fileInfo);
        this.parsingFile = null;
        this.newFileLanguage = undefined;
        this.newFilePath = undefined;
      })
      .catch(error => {
        this.isNewFileNotFound = error.status === 404;
        this.isNewFileNotValid = error.status === 422;
        this.parsingFile = null;
      });
  }

  onClickChangeUser(user: User): void {
    let oldUser = this.selectedUser;
    this.loadRepositories(user);
    this.showOtherUsers = false;
    this.selectedUser = user;
    this.otherUsers = this.otherUsers.filter(other => other.id != user.id);
    this.otherUsers.push(oldUser);
  }

  resetNewFileErrors(): void {
    this.isNewFileNotValid = false;
    this.isNewFileNotFound = false;
  }

  onClickResetLanguage(): void {
    this.newFileLanguage = undefined;
    this.newFilePath = undefined;
    this.showLanguageForm = false;
  }

  onCloseDialog(dialogRef: MdDialogRef<NewProjectDialog>): void {
    dialogRef.close();
  }

  languageOf(languageCode: string): Language {
    return LanguageService.find(languageCode);
  }

  isSaveDisabled(): boolean {
    return this.selectedRepo === undefined || this.selectedBranch === undefined || this.selectedLanguages.length === 0;
  }

  isAddLanguageDisabled(): boolean {
    return this.newFileLanguage === undefined || this.newFilePath === undefined;
  }

  createProject(dialogRef: MdDialogRef<NewProjectDialog>): void {
    // id, pendingChanges, createdBy are set by the projects-create lambda
    let payload = {
      name: this.selectedRepo.name,
      availableBranches: this.branchList,
      lastActiveBranch: this.selectedBranch,
      i18nFiles: this.selectedLanguages,
      repository: this.selectedRepo,
    };

    this.isCreatingProject = true;
    this.projectService
      .create(payload)
      .then(project => {
        this.isCreatingProject = false;
        dialogRef.close(project);
      });
  }
}