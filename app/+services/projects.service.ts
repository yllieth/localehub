import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Language, LocaleUpdate, Project } from '../+models';
import { ApiService, LanguageService } from './';

@Injectable()
export class ProjectsService {
  constructor(private api: ApiService) {}

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