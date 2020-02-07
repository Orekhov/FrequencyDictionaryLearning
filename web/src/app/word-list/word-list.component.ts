import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { AppState } from '../state/app.state';
import { NGramEntry } from '../types/types';
import { ngramListSelector, ngramListErrorSelector } from '../state/ngrams.reducer';
import { NgramsLoadAction } from '../state/ngrams.actions';

import { myDictFiltersSelector } from '../state/mydict/filters.selector';
import { MyDictFiltersState } from '../state/mydict/mydict.states';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.css']
})
export class WordListComponent implements OnInit, OnDestroy {
  componentActive = true;
  displayedColumns: string[] = ['ngram', 'addToKnown', 'count'];
  ngrams: NGramEntry[] = [];
  displayKnown = 'false';
  ngramAppliedFilters: MyDictFiltersState;

    constructor(private appStateStore: Store<AppState>) { }

ngOnInit() {
  this.appStateStore.pipe(select(ngramListSelector), takeWhile(() => this.componentActive))
    .subscribe(nl => this.ngrams = nl);
  this.appStateStore.pipe(select(ngramListErrorSelector), takeWhile(() => this.componentActive))
    .subscribe(err => console.log(err));
  this.appStateStore.pipe(select(myDictFiltersSelector), takeWhile(() => this.componentActive))
    .subscribe(f => {
      this.ngramAppliedFilters = f;
      this.appStateStore.dispatch(new NgramsLoadAction(f))
    });
}

ngOnDestroy() {
  this.componentActive = false;
}

}
