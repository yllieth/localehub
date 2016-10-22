import {Project} from "./project";

export class Member {
  avatarUrl: string;
  profileUrl: string;
  pseudo: string;
  fullname: string;
  isOrganization: boolean;
  expanded: boolean;
  projects: Project[];
}