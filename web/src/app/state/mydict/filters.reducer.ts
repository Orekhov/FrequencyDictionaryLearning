import { createReducer, on, Action } from '@ngrx/store';
import { MyDictFiltersState } from './mydict.states';
import * as FiltersActions from './filters.actions';

const initialState: MyDictFiltersState = {
    known: 'false',
    limit: 50,
    type: 'unigrams'
}

const mydictFiltersReducer = createReducer(
    initialState,
    on(FiltersActions.updateKnownAction, (state, action) => ({ ...state, known: action.known })
    ),
);

export function reducer(state: MyDictFiltersState | undefined, action: Action) {
    return mydictFiltersReducer(state, action);
}