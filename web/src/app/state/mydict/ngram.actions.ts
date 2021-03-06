import { createAction, props } from '@ngrx/store';
import { NGramDetailEntry } from '../../types/types';

export const loadNGramAction = createAction(
  '[Ngram] Load',
  props<{ nGramType: string; id: string }>()
);

export const loadSuccessAction = createAction(
  '[Ngram] Load Success',
  props<{ ngramDetail: NGramDetailEntry }>()
);

export const loadFailureAction = createAction(
  '[Ngram] Load Failure',
  props<{ error: any }>()
);

export const unloadNGramAction = createAction(
  '[Ngram] Unload'
);

export const changeKnownState = createAction(
  '[Ngram] Change known state',
  props<{ known: boolean; id: string; nGramType: string }>()
);

export const changeKnownStateSuccess = createAction(
  '[Ngram] Change known state success'
);

export const changeKnownStateFailure = createAction(
  '[Ngram] Change known state failure'
);
