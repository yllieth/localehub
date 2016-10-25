import { Injectable } from '@angular/core';
import { Group } from './shared/group';
import { PROJECTS } from './shared/projects-list.mock';

@Injectable()
export class ProjectsService {
  getProjectList(): Promise<Group[]> {
    return Promise.resolve(PROJECTS);
  }
}