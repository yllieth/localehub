import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Contributor, Repository } from '../+models';
import { ApiService } from './';

@Injectable()
export class RepositoriesService {
  constructor(private api: ApiService) {}

  /**
   * Get repositories of the user in parameter.
   * Github base request : GET api.github.com/users/{username}/repos
   *   | using lambda: gh-get-users-repos
   *   | using lambda: repositories
   *
   * @param {string} username - REQUIRED
   * @returns {Promise<Repository[]>}
   */
  getAll(username: string): Promise<Repository[]> {
    return this.api
      .get(`${ApiService.endpoint.prod}/repositories/${username}`)
      .toPromise()
      .then((response: Response) => response.json() as Repository[])
      .catch(error => Promise.reject(error));
  }

  /**
   * Get contributors of the given owner/repo.
   * Github base request : GET api.github.com/repositories/{owner}/{repo}/contributors
   *   | using lambda: gh-get-repos-contributors
   *   | using lambda: repositories-contributors
   *
   * @param {string} username - REQUIRED
   * @param {string} reponame - REQUIRED
   * @returns {Promise<Contributor[]>}
   */
  getContributors(username: string, reponame: string): Promise<Contributor[]> {
    return this.api
      .get(`${ApiService.endpoint.prod}/repositories/${username}/${reponame}/contributors`)
      .toPromise()
      .then((response: Response) => response.json() as Contributor[])
      .catch(error => Promise.reject(error));
  }
}