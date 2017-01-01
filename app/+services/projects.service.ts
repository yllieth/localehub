import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Group, Project, User } from '../+models';
import { ApiService } from './';

@Injectable()
export class ProjectsService {
  constructor(private api: ApiService) {}

  private static createGroupsFrom(users: User[], projects: Project[]): Group[] {
    let groups = [];
    for (let user of users) {
      groups.push({
        expanded: !user.is_organization,  // TODO improve this when connected user will be stored: expanded = true if user = connected user
        user: user,
        projects: projects.filter(project => { return project.owner === user.url; })
      });
    }

    return groups;
  }

  getProjectList(): Promise<Group[]> {
    return Promise.all([this.getOrganizations(), this.getProjects()])
      .then(response => ProjectsService.createGroupsFrom(response[0], response[1]))
      .catch(error => Promise.reject(error));
  }

  getOrganizations(): Promise<User[]> {
    return this.api
      .get(`${ApiService.endpoint.prod}/organizations`)
      .toPromise()
      .then((response: Response) => response.json() as User[])
      .catch(error => Promise.reject(error));
  }

  getProjects(): Promise<Project[]> {
    return this.api
      .get(`${ApiService.endpoint.prod}/projects`)
      .toPromise()
      .then((response: Response) => response.json() as Project[])
      .catch(error => Promise.reject(error));
  }

  getProject(owner: string, repo: string): Promise<Project> {
    return this.api
      .get(`${ApiService.endpoint.mock}/projects/${owner}/${repo}`)
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }
}