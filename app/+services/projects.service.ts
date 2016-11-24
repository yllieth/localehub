import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Group, Project } from '../+models';
import { ApiService, AuthenticationService } from './';

@Injectable()
export class ProjectsService {
  private projectsUrl = ApiService.baseUrl + '/projects';

  constructor(private $http: Http) {}

  getProjectList(): Promise<Group[]> {
    let headers = new Headers({ 'Authorization': AuthenticationService.getToken() });
    let options = new RequestOptions({ headers: headers });

    return this.$http
      .get(this.projectsUrl, options)
      .toPromise()
      .then((response: Response) => response.json() as Group[])
      .catch(error => Promise.reject(error));
  }

  getProject(owner: string, repo: string): Promise<Project> {
    return this.getProjectList()
      .then((projectList: Group[]) => {
        let group = projectList.find(function(project: Group) {
          return project.user.pseudo === owner;
        });

        let projects = group.projects;

        return projects.find(function(project: Project) {
          return project.name === repo;
        });
      })
  }
}