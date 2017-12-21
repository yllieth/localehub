import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { User } from '../+models';
import { ApiService } from './';

@Injectable()
export class UserService {
  constructor(private api: ApiService) {}

  getCurrentUser(): Promise<User> {
    return this.api
      .get(`${ApiService.endpoint}/current-user`)
      .toPromise()
      .then((response: Response) => response.json() as User)
      .catch(error => Promise.reject(error));
  }

  createCurrentUser(code: string, state: string): Promise<string> {
    return this.api
      .post(`${ApiService.endpoint}/current-user`, { code, state })
      .toPromise()
      .then((response: Response) => response.json().token as string)
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
      .get(`${ApiService.endpoint}/current-user/organizations`)
      .toPromise()
      .then((response: Response) => response.json() as User[])
      .catch(error => Promise.reject(error));
  }
}