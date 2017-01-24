import { User } from "./user";

/**
 * Example:
 * {
 *   "id": 69961239,
 *   "name": "localehub",
 *   "fullName": "yllieth/localehub"
 *   "description": "[WebApp] Add/update versionned I18N support to an existing application",
 *   "owner": {
 *     "id": 1174557,
 *     "login": "yllieth",
 *     "description": null,
 *     "url": "https://api.github.com/users/yllieth",
 *     "events_url": "https://api.github.com/users/yllieth/events{/privacy}",
 *     "avatar_url": "https://avatars.githubusercontent.com/u/1174557?v=3",
 *     "repos_url": "https://api.github.com/users/yllieth/repos",
 *     "is_organization": false
 *   },
 *   "url": "https://github.com/yllieth/localehub",
 *   "private": false,
 *   "fork": false
 * }
 */
export class GithubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  owner: User;
  private: boolean;
  fork: boolean;
}