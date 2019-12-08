import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { MyDictFiltersState } from '../../state/mydict/mydict.states';
import { myDictFiltersSelector } from '../../state/mydict/filters.selector';
import { updateKnownAction } from '../../state/mydict/filters.actions';
import { NGramFilters } from '../../types/types';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  public filters: NGramFilters;

  constructor(private store: Store<MyDictFiltersState>) { }

  ngOnInit() {
    this.store.pipe(select(myDictFiltersSelector)).subscribe(f => this.filters = f).unsubscribe();
  }

  onKnownChanged(e) {
    this.store.dispatch(updateKnownAction({ known: e.value }));
  }

}
