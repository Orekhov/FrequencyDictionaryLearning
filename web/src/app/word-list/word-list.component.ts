import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../state/app.state';
import { Store, select } from '@ngrx/store';
import { NGramEntry } from '../types/types';
import { ngramListSelector, ngramListErrorSelector } from '../state/ngrams.reducer';
import { NgramsLoadAction } from '../state/ngrams.actions';
import { takeWhile } from 'rxjs/operators';

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

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.pipe(select(ngramListSelector), takeWhile(() => this.componentActive))
      .subscribe(nl => this.ngrams = nl);
    this.store.pipe(select(ngramListErrorSelector), takeWhile(() => this.componentActive))
      .subscribe(err => console.log(err));
    this.dispatchReloadNgrams();
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  onFiltersChanged() {
    this.dispatchReloadNgrams();
  }

  private dispatchReloadNgrams() {
    this.store.dispatch(new NgramsLoadAction({
      known: this.displayKnown,
      limit: 50,
      type: 'unigrams'
    }));
  }

}
