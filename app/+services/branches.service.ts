import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './';
import { GithubBranch } from '../+models';

@Injectable()
export class BranchesService {
  public static APP_SUFFIX = '-localehub';

  constructor(private api: ApiService) {}

  /**
   * Remove from input array all branch names ending with "-localehub"
   *
   * @param branches
   * @returns {string[]}
   */
  static filterBaseBranches(branches: string[]) {
    var regex = new RegExp(BranchesService.APP_SUFFIX + '$');
    return branches.filter(entry => !regex.test(entry));
  }

  /**
   * Create a branch
   *
   * @param fullName - Ex: yllieth/localehub
   * @param origin - Ex: gh-test
   * @param name - Ex: gh-test-localehub
   * @returns {Promise<GithubBranch>}
   */
  create(fullName: string, origin: string, name: string): Promise<GithubBranch> {
    let username = fullName.split('/')[0];
    let repository = fullName.split('/')[1];

    return this.api
      .post(`${ApiService.endpoint.prod}/branches/${username}/${repository}`, { origin, name})
      .toPromise()
      .then((response: Response) => response.json() as GithubBranch)
      .catch(error => Promise.reject(error));
  }

  /**
   * Get all branches' names from the giver username/repository couple.
   * Github base request : GET api.github.com/repos/{owner}/{repo}/branches
   *   | using lambda: gh-get-repos-branches
   *   | using lambda: branches-get
   *
   * @param {string} repo - Ex: yllieth/localehub
   * @param {boolean} [excludeAppBranches=true] - If true, branches suffixed by APP_SUFFIX aren't returned
   * @returns {Promise<string[]>}
   */
  getNames(repo: string, excludeAppBranches?: boolean): Promise<string[]> {
    let username = repo.split('/')[0];
    let repository = repo.split('/')[1];
    let regex = new RegExp(BranchesService.APP_SUFFIX + '$');

    if (excludeAppBranches === undefined) {
      excludeAppBranches = true;
    }

    return this.api
      .get(`${ApiService.endpoint.prod}/branches/${username}/${repository}`)
      .toPromise()
      .then((response: Response) => (excludeAppBranches)
        ? response.json().filter(BranchesService.filterBaseBranches) as string[]
        : response.json() as string[])
      .catch(error => Promise.reject(error));
  }
}