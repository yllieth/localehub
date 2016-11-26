import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Group, Project } from '../+models';
import { ApiService } from './';

@Injectable()
export class ProjectsService {
  private all = () => `${ApiService.endpoint.mock}/projects`;
  private one = (owner: string, repo: string) => `${ApiService.endpoint.mock}/projects/${owner}/${repo}`;

  constructor(private api: ApiService) {}

  getProjectList(): Promise<Group[]> {
    return this.api
      .get(this.all())
      .toPromise()
      .then((response: Response) => response.json() as Group[])
      .catch(error => Promise.reject(error));
  }

  getProject(owner: string, repo: string): Promise<Project> {
    return this.api
      .get(this.one(owner, repo))
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }
}