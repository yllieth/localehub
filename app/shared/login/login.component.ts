import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GithubAuthService } from "../../+services/github-auth.service";
import { Response } from "@angular/http";

@Component({
  moduleId: module.id,
  selector: 'lh-login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ],
  providers: [ GithubAuthService ]
})
export class LoginComponent implements OnInit {
  private hasCodeAndState(query: Params): boolean {
    return query.hasOwnProperty('code') && query.hasOwnProperty('state');
  }

  constructor(
    private $route: ActivatedRoute,
    private $router: Router,
    private auth: GithubAuthService
  ) {}

  ngOnInit(): void {
    this.$route.queryParams.forEach((query: Params) => {
      if (this.hasCodeAndState(query) && this.auth.hasValidState(query)) {
        console.log('step1OK: code = ' + query['code']);

        this.$router.navigate(['/login']);

        this.auth
          .getAccessToken(query['code'])
          .then((response: Response) => console.log(response))
          .catch((error: Response) => console.error(error));
      }
    });
  }

  forgeAuthorizationUrl(): string {
    return this.auth.createAuthorizationUrl();
  }
}