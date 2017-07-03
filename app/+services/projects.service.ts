import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { LocaleUpdate, Project, Translation } from '../+models';
import { ApiService, BranchesService } from './';

@Injectable()
export class ProjectsService {
  constructor(
    private api: ApiService,
    private branchService: BranchesService
  ) {}

  /**
   * Returns the name of the github branch from where the working version is created.
   * All changes won't be committed on this one but on the working version.
   *
   * @returns {string}
   */
  static baseVersionName(project: Project): string {
    return project.lastActiveBranch;
  }

  /**
   * Return the name of the github branch on all changes will be committed.
   *
   * @returns {string}
   */
  static workingVersionName(project: Project): string {
    return project.lastActiveBranch + BranchesService.APP_SUFFIX;
  }

  /**
   * Checks if the branch list contains the working branch (suffixed).
   * If so, there is no need to create such a branch.
   *
   * @returns {boolean}
   */
  static needsToCreateWorkingVersion(project: Project): boolean {
    return project.availableBranches.indexOf(ProjectsService.workingVersionName(project)) < 0;
  }

  static getNewEntries(project: Project) {
    return project.pendingChanges.filter(change => change.branch === ProjectsService.workingVersionName(project) && change.value.oldString === undefined);
  }

  updateBranchList(project: Project): Promise<any> {
    return this.branchService.getNames(project.repository.fullName, false)
      .then(branches => this.update(project.id, 'set-availableBranches', branches));
  }

  removeFromPendingChange(translation: Translation, project: Project): Promise<Project> {
    // remove the given translation from pending changes
    let newPendingChanges: LocaleUpdate[] = project.pendingChanges
      .filter(pendingChange => !(pendingChange.branch === ProjectsService.workingVersionName(project)
        && pendingChange.languageCode === translation.language.languageCode
        && pendingChange.value.newString === translation.string));

    // update pending changes
    return this.update(project.id, 'set-pendingChanges', newPendingChanges);
  }

  commit(projectId: string, payload: { branch: string }): Promise<any> {
    return this.api
      .post(`${ApiService.endpoint.prod}/projects/${projectId}/commit`, payload)
      .toPromise()
      .then(response => response.json())
      .catch(error => Promise.reject(error));
  }

  pullRequest(projectId: string, payload: { branch: string; assignees: string[] }) {
    return this.commit(projectId, { branch: payload.branch })
      .then(/* TODO: Finish here !! */);
  }

  // --- CRUD OPERATIONS ------------------------------------------------------

  /**
   * Send given payload (with no transformation) in the Project dynamoDB table.
   * AWS base request : POST ##endpoint##/projects
   *   | using lambda: projects-create
   *
   * Payload contains the following properties:
   * {
   *   {string}   name              - github repository's name
   *   {string}   owner             - github url of the repository's owner
   *   {string}   user              - github url of the connected user
   *   {string[]} availableBranches - list of github branches' name
   *   {string}   lastActiveBranch  - default branch name
   *   {I18nFileInfo[]} i18nFiles   - supported languges
   * }
   *
   * @param {object} payload
   * @returns {Promise<Project>}
   */
  create(payload: any): Promise<Project> {
    return this.api
      .post(`${ApiService.endpoint.prod}/projects`, payload)
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }

  getList(): Promise<Project[]> {
    return this.api
      .get(`${ApiService.endpoint.prod}/projects`)
      .toPromise()
      .then((response: Response) => response.json() as Project[])
      .catch(error => Promise.reject(error));
  }

  getOne(id: string): Promise<Project> {
    return this.api
      .get(`${ApiService.endpoint.prod}/projects/${id}`)
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }

  update(projectId: string, operation: string, update: LocaleUpdate[] | string[]): Promise<Project> {
    return this.api
      .patch(`${ApiService.endpoint.prod}/projects/${projectId}`, {operation, update})
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }

  remove(projectId: string): Promise<Project> {
    return this.api
      .delete(`${ApiService.endpoint.prod}/projects/${projectId}`)
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }
}