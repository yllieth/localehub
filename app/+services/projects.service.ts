import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Group, Language, LocaleUpdate, Project, User } from '../+models';
import { ApiService, GithubService, LanguageService } from './';

@Injectable()
export class ProjectsService {
  constructor(
    private api: ApiService,
    private github: GithubService
  ) {}

  private static createGroupsFrom(users: User[], projects: Project[]): Group[] {
    let groups = [];
    for (let user of users) {
      groups.push({
        expanded: !user.is_organization,  // TODO improve this when connected user will be stored: expanded = true if user = connected user
        user: user,
        projects: projects.filter(project => project.repository.owner.login === user.login)
      });
    }

    return groups;
  }

  getProjectList(): Promise<Group[]> {
    return Promise.all([this.github.getOrganizations(), this.getProjects()])
      .then(response => ProjectsService.createGroupsFrom(response[0], response[1]))
      .catch(error => Promise.reject(error));
  }

  getProjects(): Promise<Project[]> {
    return this.api
      .get(`${ApiService.endpoint.prod}/projects`)
      .toPromise()
      .then((response: Response) => response.json() as Project[])
      .catch(error => Promise.reject(error));
  }

  getProject(id: string): Promise<Project> {
    return this.api
      .get(`${ApiService.endpoint.prod}/projects/${id}`)
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }

  remove(projectId: string): Promise<Project> {
    return this.api
      .delete(`${ApiService.endpoint.prod}/projects/${projectId}`)
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }

  update(projectId: string, operation: string, update: LocaleUpdate): Promise<Project> {
    return this.api
      .patch(`${ApiService.endpoint.prod}/projects/${projectId}`, {operation, update})
      .toPromise()
      .then((response: Response) => response.json() as Project)
      .catch(error => Promise.reject(error));
  }

  static getSupportedLanguages(project: Project): Language[] {
    let languages = [];

    for(let file of project.i18nFiles) {
      languages.push(LanguageService.find(file.languageCode));
    }

    return languages;
  }
}