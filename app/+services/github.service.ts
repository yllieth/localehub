import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { GithubRepository, I18nFileInfo, Project, User } from '../+models';
import { ApiService } from './';

@Injectable()
export class GithubService {
  constructor(private api: ApiService) {}

  /**
   * Get repositories of the user in parameter.
   * Github base request : GET api.github.com/users/{username}/repos
   *   | using lambda: gh-get-users-repos
   *   | using lambda: repositories
   *
   * @param {string} username - REQUIRED
   * @returns {Promise<GithubRepository[]>}
   */
  getRepositories(username: string): Promise<GithubRepository[]> {
    return this.api
      .get(`${ApiService.endpoint.prod}/repositories/${username}`)
      .toPromise()
      .then((response: Response) => response.json() as GithubRepository[])
      .catch(error => Promise.reject(error));
  }

  /**
   * Checks if file given in the path parameter exists in the giver repo.
   * If so, it parses the json object and count the number of defined translations.
   * Github base request : GET api.github.com/repos/:owner/:repo/contents/:path
   *   | using lambda: gh-get-repos-content
   *   | using lambda: i18nFile-parse
   *
   * @param {string} owner
   * @param {string} repo
   * @param {string} path
   * @param {string} languageCode
   * @returns {Promise<I18nFileInfo>}
   */
  checkI18nfile(owner: string, repo: string, path: string, languageCode: string): Promise<I18nFileInfo> {
    return this.api
      .post(`${ApiService.endpoint.prod}/i18n/file`, {owner, repo, path, languageCode})
      .toPromise()
      .then((response: Response) => response.json() as I18nFileInfo)
      .catch(error => Promise.reject(error));
  }

  /**
   * Get organizations of the connected user.
   * Github base request : GET api.github.com/user/orgs
   *   | using lambda: gh-get-user-orgs
   *   | using lambda: organizations
   *
   * @returns {Promise<User[]>}
   */
  getOrganizations(): Promise<User[]> {
    return this.api
      .get(`${ApiService.endpoint.prod}/organizations`)
      .toPromise()
      .then((response: Response) => response.json() as User[])
      .catch(error => Promise.reject(error));
  }

  /**
   * Get all branches' names from the giver username/repository couple.
   * Github base request : GET api.github.com/repos/{owner}/{repo}/branches
   *   | using lambda: gh-get-repos-branches
   *   | using lambda: branches-get
   *
   * @param {string} username
   * @param {string} repository
   * @returns {Promise<string[]>}
   */
  getBranches(username: string, repository: string): Promise<string[]> {
    return this.api
      .get(`${ApiService.endpoint.prod}/branches/${username}/${repository}`)
      .toPromise()
      .then((response: Response) => response.json() as string[])
      .catch(error => Promise.reject(error));
  }

  /**
   * Send given payload (with no transformation) in the Project dynamoDB table.
   * AWS base request : POST ##endpoint##/projects
   *   | using lambda: projects-create
   *
   * Payload contains the following properties:
   * {
   *   {string}   id                - generated unique identifier
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
  createProject(payload: any): Promise<Project> {
    return this.api
      .post(`${ApiService.endpoint.prod}/projects`, payload)
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }
}