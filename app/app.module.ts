import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions, Http } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyMaterialModule } from './app.material.module';
import 'hammerjs';

import { TruncatePipe } from 'angular2-truncate';
import { HighlightDiffPipe } from './+pipes/highlight-diff.pipe';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { ApiService, AuthenticationService, AuthenticationGuardService, BranchesService, ErrorService, EventService, RepositoriesService, UserService, Utils } from './+services';

import { LoginComponent } from './shared/login/login.component';
import { ErrorContainerComponent } from './shared/error/error-container.component';
import { TopbarComponent } from './shared/topbar/topbar.component';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { LanguageDetailsComponent } from './shared/language-details/language-details.component';

import { ProjectsComponent } from './projects/projects.component';
import { NewProjectComponent } from './projects/new/new-card.component';
import { NewProjectDialog } from "./projects/new/dialog/new-project.component";
import { ProjectsCardComponent } from './projects/projects-card/projects-card.component';

import { TranslationsListComponent } from './translations/list.component';
import { TranslationsNotificationComponent } from './translations/notification/notification.component';
import { TranslationsTreeComponent } from './translations/tree/tree.component';
import { LocaleFABNewComponent } from './translations/locale-fab-new/locale-fab-new.component';
import { TranslationsNewLocaleComponent } from './translations/new-locale/new-locale.component';
import { TranslationsLocaleComponent } from './translations/locale/locale.component';
import { TranslationsPreviewDialog } from './translations/preview-dialog/preview-dialog.component';
import { AssigneesSelectorComponent } from './translations/preview-dialog/assignees-selector/assignees-selector.component';

function ApiFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http {
  return new ApiService(xhrBackend, requestOptions);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MyMaterialModule,
    BrowserAnimationsModule,
    routing
  ],
  declarations: [
    AppComponent,
    TruncatePipe,
    HighlightDiffPipe,
    LoginComponent,
    ErrorContainerComponent,
    TopbarComponent,
    TitlebarComponent,
    LoaderComponent,
    LanguageDetailsComponent,
    ProjectsComponent,
    NewProjectComponent,
    NewProjectDialog,
    ProjectsCardComponent,
    TranslationsListComponent,
    TranslationsNotificationComponent,
    TranslationsTreeComponent,
    LocaleFABNewComponent,
    TranslationsNewLocaleComponent,
    TranslationsLocaleComponent,
    TranslationsPreviewDialog,
    AssigneesSelectorComponent
  ],
  entryComponents: [
    NewProjectDialog,
    TranslationsPreviewDialog
  ],
  providers: [
    { provide: Http, useFactory: ApiFactory, deps: [XHRBackend, RequestOptions]},
    ApiService,
    AuthenticationService,
    AuthenticationGuardService,
    BranchesService,
    ErrorService,
    EventService,
    RepositoriesService,
    UserService,
    Utils
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }