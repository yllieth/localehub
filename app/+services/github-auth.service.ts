import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GithubAuthService {
  /**
   * Required.
   *
   * The client ID you received from GitHub when you registered.
   * @type {string}
   */
  clientId: string = 'aa8083e66d77ff3c2b25';

  /**
   * Required.
   *
   * The secret ID you received from GitHub when you registered.
   * @type {string}
   */
  secretId: string = '86971c2a0558f392b7382d956a06d2d4c3efc686';

  /**
   * Optional.
   *
   * The URL in your application where users will be sent after authorization. See details below about redirect urls (https://developer.github.com/v3/oauth/#redirect-urls).
   * @type {string}
   */
  redirectUri: string = 'http://localhost:3000/login';

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
  scope: string = 'user';

  /**
   * Optional.
   *
   * An unguessable random string. It is used to protect against cross-site request forgery attacks.
   * @type {string}
   */
  state: string = '42';

  /**
   * Optional.
   *
   * Whether or not unauthenticated users will be offered an option to sign up for GitHub during the OAuth flow.
   * The default is true. Use false in the case that a policy prohibits signups.
   * @type {string}
   */
  allowSignup: string = 'true';

  constructor(
    private $http: Http
  ) {}

  createAuthorizationUrl(): string {
    return 'https://github.com/login/oauth/authorize' +
      '?client_id=' + this.clientId +
      '&redirect_uri=' + this.redirectUri +
      '&scope=' + this.scope +
      '&state=' + this.state +
      '&allow_signup=' + this.allowSignup;
  }

  private createAuthenticationParameters(code: string): any {
    return {
      clientId: this.clientId,
      secretId: this.secretId,
      code: code,
      redirectUri: this.redirectUri,
      state: this.state
    };
  }

  hasValidState(query: Params): boolean {
    return query.hasOwnProperty('state') && query['state'] === this.state;
  }

  getAccessToken(code: string): Promise {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'        // Tell to github I want the response in json format (xml also available)
    });
    let options = new RequestOptions({ headers: headers });

    return this.$http
      .post('https://github.com/login/oauth/access_token', this.createAuthenticationParameters(code), options)
      .toPromise();
  }
}
