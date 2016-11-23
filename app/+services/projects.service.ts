import { Injectable } from '@angular/core';
import { Group, Project } from '../+models';
import { PROJECTS } from '../+mocks';

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
        let project = projects.find(function(project: Project) {
          return project.name === repo;
        });

        if (project === undefined) {
          throw new Error;
        }

        return project;
      });
  }
}