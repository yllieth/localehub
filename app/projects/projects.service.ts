import {Injectable} from "@angular/core";
import {Member} from "./shared/member";
import {PROJECTS} from "./shared/projects-list.mock";

@Injectable()
export class ProjectsService {
  getProjectList(): Promise<Member[]> {
    return Promise.resolve(PROJECTS);
  }
}