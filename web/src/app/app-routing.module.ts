import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { WordListComponent } from './word-list/word-list.component';
import { NgramViewComponent } from './ngram-view/ngram-view.component';
import { StatsComponent } from './stats/stats.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './services/auth.guard';
import { WelcomeGuard } from './services/welcome.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainPageComponent,
    children: [
      {
        path: 'main',
        component: WordListComponent,
        data: {
          title: 'My dictionary'
        }
      },
      {
        path: 'stats',
        component: StatsComponent,
        data: {
          title: 'My statistics'
        }
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        data: {
          title: 'NGram Dict Privacy Policy'
        }
      },
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'ngram/:ngram',
    component: NgramViewComponent
  },
  {
    path: 'welcome',
    canActivate: [WelcomeGuard],
    component: WelcomeComponent
  },
  {
    path: '**',
    redirectTo: 'main'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
