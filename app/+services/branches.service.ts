import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './';

@Injectable()
export class BranchesService {
  public static APP_SUFFIX = '-localehub';

  constructor(private api: ApiService) {}

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
        ? response.json().filter(branchName => !regex.test(branchName)) as string[]
        : response.json() as string[])
      .catch(error => Promise.reject(error));
  }
}