import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule} from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './init/app-material.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { WordListComponent } from './word-list/word-list.component';
import { NgramViewComponent } from './ngram-view/ngram-view.component';
import { StatsComponent } from './stats/stats.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { environment } from '../environments/environment';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthService } from './services/auth.service';
import { LoginInfoComponent } from './login-info/login-info.component';
import { TokenInterceptor } from './services/token.interceptor';
import { AddNgramsComponent } from './add-ngrams/add-ngrams.component';
import { addRawReducer } from './state/add.raw.reducer';
import { NGramsEffects } from './state/ngrams.effects';
import { ngramListReducer } from './state/ngrams.reducer';
import { FiltersComponent } from './mydict/filters/filters.component';
import { mydictFeatureKey } from './state/mydict/mydict.feature';
import * as filtersReducer from './state/mydict/filters.reducer';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    WordListComponent,
    NgramViewComponent,
    StatsComponent,
    PrivacyPolicyComponent,
    WelcomeComponent,
    LoginInfoComponent,
    AddNgramsComponent,
    FiltersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppMaterialModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot({
      addRaw: addRawReducer,
      ngramlist: ngramListReducer
    }),
    StoreModule.forFeature(mydictFeatureKey, {
      filters: filtersReducer.reducer
    }),
    StoreDevtoolsModule.instrument({
      name: 'ngram dict devtools',
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([NGramsEffects])
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
