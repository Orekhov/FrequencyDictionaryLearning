import { NGramEntry } from '../types/types';
import { createFeatureSelector, createSelector, createReducer } from '@ngrx/store';
import { NgramsActions, NgramsActionTypes } from './ngrams.actions';

export interface NgramListState {
  ngrams: NGramEntry[];
  error: string;
  togglingKnown: string[];
}

const initialState: NgramListState = {
  ngrams: [],
  error: '',
  togglingKnown: []
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

export const ngramTogglingSelector = createSelector(
  ngramListStateSelector,
  s => s.togglingKnown
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
      };
    case NgramsActionTypes.ToggleKnown:
      return {
        ...state,
        togglingKnown: state.togglingKnown.concat([action.id])
      };
    case NgramsActionTypes.ToggleKnownSuccess:
      const newState = JSON.parse(JSON.stringify(state)) as NgramListState;
      newState.ngrams = newState.ngrams.filter(n => n.id !== action.id);
      newState.togglingKnown = newState.togglingKnown.filter(n => n === action.id);
      return newState;
    case NgramsActionTypes.ToggleKnownFailure:
      return {
        ...state,
        togglingKnown: state.togglingKnown.filter(n => n === action.id)
      };
    default:
      return state;
  }
}
