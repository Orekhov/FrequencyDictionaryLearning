import { NGramEntry } from '../types/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NgramsActions, NgramsActionTypes } from './ngrams.actions';

export interface NgramListState {
    ngrams: NGramEntry[]
    error: string;
}

const initialState: NgramListState = {
    ngrams: [],
    error: ''
};

export const ngramListStateSelector = createFeatureSelector<NgramListState>('ngramlist');

export const ngramListSelector = createSelector(
    ngramListStateSelector,
    s => s.ngrams
);

export const ngramListErrorSelector = createSelector(
    ngramListStateSelector,
    s => s.error
);

export function ngramListReducer(state: NgramListState = initialState, action: NgramsActions): NgramListState {
    switch (action.type) {
        case NgramsActionTypes.LoadSuccess:
            return {
                ...state,
                ngrams: action.ngramEntries,
                error: ''
            };
        case NgramsActionTypes.LoadFailure:
            return {
                ...state,
                ngrams: [],
                error: action.error
            }
        default:
            return state;
    }
}
