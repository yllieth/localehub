import { Injectable } from '@angular/core';
import { Group } from '../+models/group';
import { Project } from '../+models/project';
import { PROJECTS } from '../+mocks/projects-list.mock';

@Injectable()
export class ProjectsService {
  getProjectList(): Promise<Group[]> {
    return Promise.resolve(PROJECTS);
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