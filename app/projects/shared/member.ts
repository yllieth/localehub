import {Project} from "./project";

export class Member {
  avatarUrl: string;
  pseudo: string;
  fullname: string;
  isOrganization: boolean;
  projects: Project[];
  expanded: boolean;
}