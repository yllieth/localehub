import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Http } from '@angular/http';
import { GithubAuthService } from '../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ],
  providers: [ GithubAuthService ]
})
export class LoginComponent implements OnInit {
  constructor(
    private $route: ActivatedRoute,
    private $router: Router,
    private $http: Http,
    private auth: GithubAuthService
  ) {}

  ngOnInit(): void {
    this.$route.queryParams.forEach((query: Params) => {
      if (this.auth.isOauthStep1(query) === true) {
        // hide state & code from the address bar
        this.$router.navigate(['/login']);

        // oauthStep1
        this.auth
          .getAccessToken(query['code'])
          .map(res => res.json())
          .subscribe(token => console.log(token));
      } else {
        // do nothing
        // go there when the user manually navigate to /login or is redirected by the AuthGuard
      }
    })
  }

  startOauthDance(): string {
    return this.auth.createAuthorizationUrl();
  }
}