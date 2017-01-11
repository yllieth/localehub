import { User } from "./user";

export class GithubRepository {
  id: number;
  name: string;
  description: string;
  owner: User;
  private: boolean;
  fork: boolean;
}