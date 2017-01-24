import { GithubRepository, I18nFileInfo, User } from './';

/**
 * Example:
 * {
 *   "id": "e11995b2-deb0-4b1f-97fc-f6321b766c24",
 *   "name": "localehub",
 *   "availableBranches": ["gh-test", "master", "tp-issue-20", "tp-new-project-dialog", "tp-simple-github-authentication"],
 *   "lastActiveBranch": "master",
 *   "repository": {
 *     "id": 1.0,
 *     "name": "localehub",
 *     "full_name": "yllieth/localehub",
 *     "description": "''",
 *     "owner": {
 *       "id": 1174557,
 *       "login": "yllieth",
 *       "description": "",
 *       "url": "https://github.com/yllieth",
 *       "avatar_url": "https://avatars.githubusercontent.com/u/1174557?v=3",
 *       "events_url": "https://api.github.com/users/yllieth/events{/privacy}",
 *       "repos_url": "https://api.github.com/users/yllieth/repos",
 *       "is_organization": false
 *     },
 *     "url": "https://github.com/yllieth/localehub",
 *     "private": false,
 *     "fork": false
 *   },
 *   "user": "https://api.github.com/users/yllieth", // temp
 *   "createdBy": {
 *     "id": 1174557,
 *     "login": "yllieth",
 *     "description": "",
 *     "url": "https://github.com/yllieth",
 *     "avatar_url": "https://avatars.githubusercontent.com/u/1174557?v=3",
 *     "events_url": "https://api.github.com/users/yllieth/events{/privacy}",
 *     "repos_url": "https://api.github.com/users/yllieth/repos",
 *     "is_organization": false
 *   },
 *   "i18nFiles": [
 *     { "count": 29, "languageCode": "en-US", "format": "json", "repo": "yllieth/localehub", "branch": "master", "path": "assets/test/en-US.json" }
 *   ]
 * }
 */
export class Project {
  id: string;
  name: string;
  availableBranches: string[];
  lastActiveBranch: string;
  i18nFiles: I18nFileInfo[];
  repository: GithubRepository;
  createdBy: User;
}