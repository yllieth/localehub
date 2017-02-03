import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { User } from '../+models';
import { ErrorService, GithubService } from './';

@Injectable()
export class AuthenticationService {
  /**
   * Required.
   *
   * The client ID you received from GitHub when you registered.
   * @type {string}
   */
  // clientId: string = 'aa8083e66d77ff3c2b25';   // Application "Localehub" créée par Sylvain
  private clientId: string = '4c94850689acfd142b09';   // Application "TEST2" créée par Eric

  /**
   * Optional.
   *
   * The URL in your application where users will be sent after authorization. See details below about redirect urls (https://developer.github.com/v3/oauth/#redirect-urls).
   * @type {string}
   */
  private redirectUri: string = 'http://localhost:3000/login';

  /**
   * Optional.
   *
   * A space delimited list of scopes. If not provided, scope defaults to an empty list for users that have not authorized
   * any scopes for the application. For users who have authorized scopes for the application, the user won't be shown the
   * OAuth authorization page with the list of scopes. Instead, this step of the flow will automatically complete with the
   * set of scopes the user has authorized for the application. For example, if a user has already performed the web flow
   * twice and has authorized one token with user scope and another token with repo scope, a third web flow that does not
   * provide a scope will receive a token with user and repo scope.
   * @type {string}
   */
  private scope: string = 'repo';

  /**
   * Optional.
   *
   * An unguessable random string. It is used to protect against cross-site request forgery attacks.
   * @type {string}
   */
  private state: string = '42';

  /**
   * Optional.
   *
   * Whether or not unauthenticated users will be offered an option to sign up for GitHub during the OAuth flow.
   * The default is true. Use false in the case that a policy prohibits signups.
   * @type {string}
   */
  private allowSignup: string = 'true';

  private currentUser: User;

  constructor(
    private $router: Router,
    private githubService: GithubService,
    private errorService: ErrorService
  ) {}

  private static isValidToken(token: string): boolean {
    let pattern = new RegExp(/[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}/);
    return token && token.length == 36 && pattern.test(token);
  }

  githubLoginUrl(): string {
    return 'https://github.com/login/oauth/authorize' +
      '?client_id=' + this.clientId +
      '&redirect_uri=' + this.redirectUri +
      '&scope=' + this.scope +
      '&state=' + this.state +
      '&allow_signup=' + this.allowSignup;
  }

  isOauthStep1(query: Params): boolean {
    return query.hasOwnProperty('code')
      && query.hasOwnProperty('state')
      && query['state'] === this.state;
  }

  static hasToken(valid: boolean = false): boolean {
    return (valid === true)
      ? localStorage.getItem('token') !== null && AuthenticationService.isValidToken(localStorage.getItem('token'))
      : localStorage.getItem('token') !== null;
  }

  static getToken(): string {
    return localStorage.getItem('token');
  }

  saveToken(token: string): AuthenticationService {
    if (AuthenticationService.isValidToken(token) === true) {
      localStorage.setItem('token', token);
    } else {
      this.errorService.handleHttpError('422-001', { token: token });
    }

    return this;
  }

  redirection():void {
    if (AuthenticationService.hasToken()) {
      this.$router.navigate(['/projects']);
    }
  }

  initCurrentUser(): Promise<User> {
    return (this.currentUser === undefined)
      ? this.githubService.getCurrentUser()
      : Promise.resolve(this.currentUser);
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  getState(): string {
    return this.state;
  }
}