import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './init/app-material.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { WordListComponent } from './word-list/word-list.component';
import { NgramViewComponent } from './ngram-view/ngram-view.component';
import { StatsComponent } from './stats/stats.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    WordListComponent,
    NgramViewComponent,
    StatsComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppMaterialModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
