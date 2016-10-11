import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsComponent } from './projects/projects.component';
import { LocalesComponent } from './locales/locales.component';
import { LoginComponent } from "./shared/login/login.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'locales', component: LocalesComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);