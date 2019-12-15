import { createReducer, on, Action } from '@ngrx/store';
import { NGramDetailState } from './mydict.states';
import * as NgramActions from './ngram.actions';

const initialState: NGramDetailState = {
  counts: null,
  item: null,
  known: null,
  totalCount: null
};

const ngramDetailReducer = createReducer(
  initialState,
  on(NgramActions.loadSuccessAction, (state, action) => ({ ...state, ...action}))
);

export function reducer(state: NGramDetailState | undefined, action: Action) {
  return ngramDetailReducer(state, action);
}
