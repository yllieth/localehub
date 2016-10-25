import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsComponent } from './projects/projects.component';
import { TranslationsListComponent } from './translations/list.component';
import { LoginComponent } from "./shared/login/login.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'translations/:projectOwner/:projectRepo', component: TranslationsListComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);