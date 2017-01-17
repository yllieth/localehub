import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { GithubRepository, User } from '../+models';
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
}