import { I18nFileInfo } from './';

/**
 * Example:
 * {
 *    "id": "57a889ab510b2ce22daeee41fb8d0872",
 *    "name": "project 3",
 *    "user": "https://api.github.com/users/yllieth",
 *    "owner": "https://api.github.com/users/yllieth",
 *    "availableBranches": ["tp-branch1", "master", "pu-20161002"],
 *    "lastActiveBranch": "master",
 *    "i18nFiles": [
 *      {
 *        "count": 128.0,
 *        "path": "config/locales/fr.yml",
 *        "languageCode": "fr",
 *        "format": "yml"
 *      }
 *    ]
 * }
 */
export class Project {
  id: string;
  name: string;
  user: string;   // Github API Url of user who create the project on LocaleHub app
  owner: string;  // Github API Url of user who create the project on github
  availableBranches: string[];
  lastActiveBranch: string;
  i18nFiles: I18nFileInfo[];
}