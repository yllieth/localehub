import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { TruncatePipe } from 'angular2-truncate';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { ErrorService, EventService } from './+services';

import { LoginComponent } from "./shared/login/login.component";
import { ErrorContainerComponent } from './shared/error/error-container.component';
import { TopbarComponent } from './shared/topbar/topbar.component';
import { TitlebarComponent } from './titlebar/titlebar.component';

import { ProjectsComponent } from './projects/projects.component';
import { SeparatorComponent } from './projects/separator/separator.component';
import { NewProjectComponent } from './projects/new/new-card.component';
import { ProjectsCardComponent } from './projects/projects-card/projects-card.component';

import { TranslationsListComponent } from './translations/list.component';
import { TranslationsNotificationComponent } from './translations/notification/notification.component';
import { TranslationsTreeComponent } from './translations/tree/tree.component';
import { TranslationsContainerComponent } from './translations/container/container.component';
import { TranslationsLocaleComponent } from './translations/container/locale/locale.component';

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
    ErrorContainerComponent,
    TopbarComponent,
    TitlebarComponent,
    ProjectsComponent,
    SeparatorComponent,
    NewProjectComponent,
    ProjectsCardComponent,
    TranslationsListComponent,
    TranslationsNotificationComponent,
    TranslationsTreeComponent,
    TranslationsContainerComponent,
    TranslationsLocaleComponent
  ],
  providers: [ ErrorService, EventService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }