import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsComponent } from './projects/projects.component';
import { LocalesComponent } from './locales/locales.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectsComponent },
  { path: 'locales', component: LocalesComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);