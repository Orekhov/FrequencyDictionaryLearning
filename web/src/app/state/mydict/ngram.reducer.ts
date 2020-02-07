import { createReducer, on, Action } from '@ngrx/store';
import { NGramDetailState } from './mydict.states';
import * as NgramActions from './ngram.actions';
import { nGramDetailInitialState } from './ngram.model';

const ngramDetailReducer = createReducer(
  nGramDetailInitialState,
  on(NgramActions.loadSuccessAction, (state: NGramDetailState, action): NGramDetailState => ({ ...state, ngram: { ...action.ngramDetail } })),
  on(NgramActions.loadFailureAction, (state: NGramDetailState, action): NGramDetailState => ({ ...state, error: action.error })),
  on(NgramActions.unloadNGramAction, (state: NGramDetailState, action): NGramDetailState => ({ ...state, ...nGramDetailInitialState })),
  on(NgramActions.changeKnownStateSuccess, (state: NGramDetailState, action): NGramDetailState => {
    const newState = <NGramDetailState>JSON.parse(JSON.stringify(state));
    newState.ngram.known = !newState.ngram.known;
    return newState;
  })
);

export function reducer(state: NGramDetailState | undefined, action: Action) {
  return ngramDetailReducer(state, action);
}
