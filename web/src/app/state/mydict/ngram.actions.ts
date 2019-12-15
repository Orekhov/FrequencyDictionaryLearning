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
