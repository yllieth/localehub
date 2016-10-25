import { Project } from './project';
import { User } from './user';

export class Group {
  expanded: boolean;
  user: User;
  projects: Project[];
}