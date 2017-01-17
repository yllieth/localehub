import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './';
import { GithubRepository } from "../+models";

@Injectable()
export class GithubService {
  constructor(private api: ApiService) {}

  getRepositories(username: string): Promise<GithubRepository[]> {
    return this.api
      .get(`${ApiService.endpoint.prod}/repositories/${username}`)
      .toPromise()
      .then((response: Response) => response.json() as GithubRepository[])
      .catch(error => Promise.reject(error));
  }
}