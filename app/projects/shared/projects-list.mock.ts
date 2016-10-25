import { Group } from "./group";
import { User } from "./user";
import { Project } from "./project";

// Users sample
const yllieth: User = {
  avatarUrl: 'https://avatars3.githubusercontent.com/u/1174557?v=3&s=466',
  profileUrl: 'https://github.com/yllieth',
  pseudo: 'yllieth',
  fullname: 'Sylvain RAGOT',
  isOrganization: false
};
const predicsis: User = {
  avatarUrl: 'https://avatars3.githubusercontent.com/u/6170002?v=3&s=200',
  profileUrl: 'https://github.com/predicsis',
  fullname: 'PredicSis',
  pseudo: null,
  isOrganization: true
};
const coocoonhome: User = {
  avatarUrl: 'https://avatars2.githubusercontent.com/u/13524192?v=3&s=200',
  profileUrl: 'https://github.com/coocoonhome',
  fullname: 'Coocoonhome',
  pseudo: null,
  isOrganization: true
};
const localehub: User = {
  avatarUrl: null,
  profileUrl: 'https://github.com/localehub',
  fullname: 'LocaleHub',
  pseudo: null,
  isOrganization: true
};

// Projects sample
const githubDashboard: Project = {
  owner: 'yllieth',
  name: 'github-dashboard',
  url: '',
  lastActiveBranch: 'master',
  availableBranches: ['master', 'tp-branch1', 'pu-20161002']
};
const project2: Project = {
  owner: 'yllieth',
  name: 'other project with a very long name',
  url: '',
  lastActiveBranch: 'master',
  availableBranches: ['master', 'tp-branch1', 'pu-20161002']
};
const project3: Project = {
  owner: 'yllieth',
  name: 'project 3',
  url: '',
  lastActiveBranch: 'master',
  availableBranches: ['master', 'tp-branch1', 'pu-20161002']
};
const project4: Project = {
  owner: 'yllieth',
  name: 'project4',
  url: '',
  lastActiveBranch: 'master',
  availableBranches: ['master', 'tp-branch1', 'pu-20161002']
};
const project5: Project = {
  owner: 'yllieth',
  name: 'project 5',
  url: '',
  lastActiveBranch: 'master',
  availableBranches: ['master', 'tp-branch1', 'pu-20161002']
};

// Mock the list of projects
export const PROJECTS: Group[] = [
  {
    expanded: true,
    user: yllieth,
    projects: [ githubDashboard, project2, project3, project4, project5 ]
  },
  {
    expanded: false,
    user: predicsis,
    projects: []
  },
  {
    expanded: false,
    user: coocoonhome,
    projects: []
  },
  {
    expanded: false,
    user: localehub,
    projects: []
  }
];