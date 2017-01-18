import { I18nFileInfo } from './';

export class Project {
  id: string;
  name: string;
  user: string;
  owner: string;
  availableBranches: string[];
  lastActiveBranch: string;
  i18nFiles: I18nFileInfo[];
}