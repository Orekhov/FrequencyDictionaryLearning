import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { WordListComponent } from './word-list/word-list.component';
import { NgramViewComponent } from './ngram-view/ngram-view.component';
import { StatsComponent } from './stats/stats.component';


const routes: Routes = [
  {
    path: '',
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
    path: '**',
    redirectTo: 'main'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
