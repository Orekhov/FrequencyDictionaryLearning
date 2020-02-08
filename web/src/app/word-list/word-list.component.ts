import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { AppState } from '../state/app.state';
import { NGramEntry, NGramDetailEntry } from '../types/types';
import { ngramListSelector, ngramListErrorSelector, ngramTogglingSelector, ngramListStateSelector } from '../state/ngrams.reducer';
import { NgramsLoadAction, NgramToggleKnownAction } from '../state/ngrams.actions';

import { myDictFiltersSelector } from '../state/mydict/filters.selector';
import { MyDictFiltersState } from '../state/mydict/mydict.states';

interface NGramEntryVm extends NGramEntry {
  toggling: boolean;
}

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.css']
})
export class WordListComponent implements OnInit, OnDestroy {
  componentActive = true;
  displayedColumns: string[] = ['ngram', 'changeKnownState', 'count'];
  ngrams: NGramEntry[] = [];
  toggling: string[] = [];
  ngramsVm: NGramEntryVm[] = [];
  displayKnown = 'false';
  ngramAppliedFilters: MyDictFiltersState;

  constructor(private appStateStore: Store<AppState>) { }

  ngOnInit() {
    this.appStateStore.pipe(select(ngramListSelector), takeWhile(() => this.componentActive))
      .subscribe(nl => {
        this.ngrams = nl;
        this.updateNgramsVm();
      });
    this.appStateStore.pipe(select(ngramListErrorSelector), takeWhile(() => this.componentActive))
      .subscribe(err => console.log(err));
    this.appStateStore.pipe(select(myDictFiltersSelector), takeWhile(() => this.componentActive))
      .subscribe(f => {
        this.ngramAppliedFilters = f;
        this.appStateStore.dispatch(new NgramsLoadAction(f));
      });
    this.appStateStore.pipe(select(ngramTogglingSelector), takeWhile(() => this.componentActive))
      .subscribe(t => {
        this.toggling = t;
        this.updateNgramsVm();
      });
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  changeKnownState(ngram: NGramEntry) {
    this.appStateStore.dispatch(new NgramToggleKnownAction(this.ngramAppliedFilters.type, ngram.id, !ngram.known));
  }

  updateNgramsVm() {
    this.ngramsVm = this.ngrams.map(ngram => {
      const toggling = this.toggling.some(t => t === ngram.id);
      return {
        ...ngram,
        toggling
      } as NGramEntryVm;
    });
  }

}
