import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsComponent } from './projects/projects.component';
import { TranslationsListComponent } from './translations/list.component';
import { LoginComponent } from './shared/login/login.component';
import { ErrorContainerComponent } from './shared/error/error-container.component';
import { AuthenticationGuardService } from './+services';

let errorPage = 'error/:errorId';
let projectPage = 'projects';
let translationPage = 'translations/:projectOwner/:projectRepo';

const appRoutes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: errorPage,       component: ErrorContainerComponent},
  { path: projectPage,     component: ProjectsComponent,         canActivate: [AuthenticationGuardService] },
  { path: translationPage, component: TranslationsListComponent, canActivate: [AuthenticationGuardService] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);