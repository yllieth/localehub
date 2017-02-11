import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthenticationService, UserService } from '../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})
export class LoginComponent implements OnInit {
  constructor(
    private $route: ActivatedRoute,
    private $router: Router,
    private authentication: AuthenticationService,
    private userService : UserService
  ) {}

  ngOnInit(): void {
    this.$route.queryParams.forEach((query: Params) => {
      if (this.authentication.isOauthStep1(query) === true) {
        // hide state & code from the address bar
        this.$router.navigate(['/login']);

        this.userService
          .createCurrentUser(query['code'], this.authentication.getState())
          .then(token => this.authentication.saveToken(token).redirection());
      } else {
        // do nothing
        // go there when the user manually navigate to /login or is redirected by the AuthGuard
      }
    })
  }

  startOauthDance(): string {
    return this.authentication.githubLoginUrl();
  }
}