import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './';
import { GithubRepository } from "../+models";

@Injectable()
export class GithubService {
  constructor(private api: ApiService) {}

  getRepositories(onlyNames?: boolean): Promise<GithubRepository[]> {
    onlyNames = onlyNames || false;
    let url = `${ApiService.endpoint.prod}/repositories`;

    return this.api
      .get((onlyNames === true) ? url + '?format=names' : url)
      .toPromise()
      .then((response: Response) => response.json() as GithubRepository[])
      .catch(error => Promise.reject(error));
  }
}