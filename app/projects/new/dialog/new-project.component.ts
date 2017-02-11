import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { AuthenticationService, ErrorService, GithubService, LanguageService, TranslationsService, UserService } from '../../../+services';
import { GithubRepository, I18nFileInfo, Language, User } from '../../../+models';

@Component({
  moduleId: module.id,
  selector: 'new-project-dialog',
  templateUrl: 'new-project.component.html',
  styleUrls: [ 'new-project.component.css' ],
  providers: [ TranslationsService ]
})
export class NewProjectDialog implements OnInit {
  existingProjects: string[]; // from ProjectsComponent.openNewProjectDialog : newProjectDialog.componentInstance.existingProjects = projects.map(project => project.name);
  selectedUser: User;
  otherUsers: User[];
  showOtherUsers: boolean;
  selectedRepo: GithubRepository;
  repositoryList: GithubRepository[];
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
    private githubService: GithubService,
    private errorService: ErrorService,
    private authenticationService: AuthenticationService,
    private translationsService: TranslationsService,
    public newProjectDialog: MdDialogRef<NewProjectDialog>
  ) { }

  private loadRepositories(user: User) {
    this.repositoryList = undefined;  // tested in the view to show the loader
    this.githubService
      .getRepositories(user.login)
      .then((repos: GithubRepository[]) => this.repositoryList = repos.filter(githubRepo => this.existingProjects.indexOf(githubRepo.fullName) === -1))
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

    this.userService
      .getOrganizations()
      .then((users: User[]) => this.otherUsers = users.filter(user => user.id != this.selectedUser.id));

    this.authenticationService
      .initCurrentUser()
      .then((user: User) => {
        this.selectedUser = user;
        this.loadRepositories(user);
      })
      /*.catch(error => this.errorService.handleHttpError('404-001', error))*/;
  }

  onSelectRepository(repository: GithubRepository) {
    this.branchList = undefined;      // tested in the view to show the loader
    this.selectedBranch = undefined;  // reset branch if the repo changes after selecting a branch for a previous one
    this.githubService
      .getBranches(repository.fullName)
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
    this.githubService
      .createProject(payload)
      .then(project => {
        this.isCreatingProject = false;
        dialogRef.close(project);
      });
  }
}