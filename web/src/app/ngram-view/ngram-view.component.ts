import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../state/app.state';
import * as ngramActions from '../state/mydict/ngram.actions';
import { nGramDetailSelector, nGramDetailErrorSelector } from '../state/mydict/ngram.selector';
import { NGramDetailEntry } from '../types/types';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-ngram-view',
  templateUrl: './ngram-view.component.html',
  styleUrls: ['./ngram-view.component.css']
})
export class NgramViewComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private appStateStore: Store<AppState>
  ) { }

  ngramId: string;
  ngramType: string;
  ngramEntry: NGramDetailEntry;
  displayedColumns: string[] = ['source', 'count'];
  componentActive = true;

  ngOnInit() {
    const paramMap = this.route.snapshot.paramMap;
    this.ngramType = paramMap.get('ngramType');
    this.ngramId = paramMap.get('ngramId');
    this.appStateStore.dispatch(ngramActions.loadNGramAction({ nGramType: this.ngramType, id: this.ngramId }));
    this.appStateStore.pipe(select(nGramDetailSelector), takeWhile(() => this.componentActive))
      .subscribe(n => this.ngramEntry = n);
    this.appStateStore.pipe(select(nGramDetailErrorSelector), takeWhile(() => this.componentActive))
      .subscribe(e => console.log(e));
  }

  ngOnDestroy(): void {
    this.componentActive = false;
    this.appStateStore.dispatch(ngramActions.unloadNGramAction());
  }

}
