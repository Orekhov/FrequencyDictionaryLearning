import { createReducer, on, Action } from '@ngrx/store';
import { NGramDetailState } from './mydict.states';
import * as NgramActions from './ngram.actions';
import { nGramDetailInitialState } from './ngram.model';

const ngramDetailReducer = createReducer(
  nGramDetailInitialState,
  on(NgramActions.loadSuccessAction, (state, action) => ({ ...state, ngram: { ...action.ngramDetail } })),
  on(NgramActions.loadFailureAction, (state, action) => ({ ...state, error: action.error }))
);

export function reducer(state: NGramDetailState | undefined, action: Action) {
  return ngramDetailReducer(state, action);
}
