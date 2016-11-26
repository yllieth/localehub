import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Group, Project } from '../+models';
import { ApiService, AuthenticationService } from './';

@Injectable()
export class ProjectsService {
  private all = () => `${ApiService.endpoint.mock}/projects`;
  private one = (owner: string, repo: string) => `${ApiService.endpoint.mock}/projects/${owner}/${repo}`;

  constructor(private $http: Http) {}

  getProjectList(): Promise<Group[]> {
    let headers = new Headers({ 'Authorization': AuthenticationService.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.$http
      .get(this.all(), options)
      .toPromise()
      .then((response: Response) => response.json() as Group[])
      .catch(error => Promise.reject(error));
  }

  getProject(owner: string, repo: string): Promise<Project> {
    let headers = new Headers({ 'Authorization': AuthenticationService.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.$http
      .get(this.one(owner, repo), options)
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }
}