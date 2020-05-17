import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { MyDictFiltersState } from '../../state/mydict/mydict.states';
import { myDictFiltersSelector } from '../../state/mydict/filters.selector';
import { sourcesSelector } from '../../state/mydict/sources.selector';
import { loadSourcesAction } from '../../state/mydict/sources.actions';
import { updateKnownAction, updateTypeAction } from '../../state/mydict/filters.actions';
import { NGramFilters, Source } from '../../types/types';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, OnDestroy {

  public filters: NGramFilters;
  public sources: Source[];

  public sourcesSubscription: any;

  constructor(private store: Store<MyDictFiltersState>) { }

  ngOnInit() {
    this.store.pipe(select(myDictFiltersSelector)).subscribe(f => this.filters = f).unsubscribe();
    this.sourcesSubscription = this.store.pipe(select(sourcesSelector)).subscribe(s => this.sources = s);
    this.store.dispatch(loadSourcesAction({ lang: 'no' }));
  }

  ngOnDestroy(): void {
    this.sourcesSubscription.unsubscribe();
  }

  onKnownChanged(e) {
    this.store.dispatch(updateKnownAction({ known: e.value }));
  }

  onNgramTypeChanged(e) {
    this.store.dispatch(updateTypeAction({ nGramType: e.value }));
  }

}
