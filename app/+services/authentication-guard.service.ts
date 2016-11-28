import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './';

@Injectable()
export class AuthenticationGuardService implements CanActivate {

  constructor(private $router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if (AuthenticationService.hasToken(true) === true) {
      return true;
    } else {
      this.$router.navigate(['/login']);
      return false;
    }
  }

}