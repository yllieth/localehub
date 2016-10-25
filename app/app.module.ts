import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { LoginComponent } from "./shared/login/login.component";
import { TruncatePipe } from 'angular2-truncate';

import { TopbarComponent } from './shared/topbar/topbar.component';
import { TitlebarComponent } from './titlebar/titlebar.component';

import { ProjectsComponent } from './projects/projects.component';
import { SeparatorComponent } from './projects/separator/separator.component';
import { NewProjectComponent } from "./projects/new/new-card.component";
import { ProjectsCardComponent } from "./projects/projects-card/projects-card.component";

import { TranslationsListComponent } from './translations/list.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    routing
  ],
  declarations: [
    AppComponent,
    TruncatePipe,
    LoginComponent,
    TopbarComponent,
    TitlebarComponent,
    ProjectsComponent,
    SeparatorComponent,
    NewProjectComponent,
    ProjectsCardComponent,
    TranslationsListComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }