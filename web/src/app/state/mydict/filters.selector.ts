import { createSelector } from '@ngrx/store';
import { selectMyDictFeature } from './mydict.selector';

export const myDictFiltersSelector = createSelector(
    selectMyDictFeature,
    s => s.filters
);