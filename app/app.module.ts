import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import './rxjs-extensions';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { HeroService } from './hero.service';
import { HeroesComponent } from './heroes.component';
import { HeroSearchComponent } from './hero-search.component';
import { HeroDetailComponent } from './hero-detail.component';
import { DashboardComponent } from './dashboard.component'

@NgModule({
  imports: [ BrowserModule, FormsModule, HttpModule, InMemoryWebApiModule.forRoot(InMemoryDataService), routing ],
  declarations: [ AppComponent, HeroDetailComponent, HeroesComponent, DashboardComponent, HeroSearchComponent ],
  providers: [ HeroService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }