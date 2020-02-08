import { Action } from '@ngrx/store';
import { NGramEntry, NGramFilters } from '../types/types';

export enum NgramsActionTypes {
  Load = '[Ngrams] Load',
  LoadSuccess = '[Ngrams] Load success',
  LoadFailure = '[Ngrams] Load failure',
  ToggleKnown = '[Ngrams] Toggle known',
  ToggleKnownSuccess = '[Ngrams] Toggle known success',
  ToggleKnownFailure = '[Ngrams] Toggle known failure'
}

export class NgramsLoadAction implements Action {
  readonly type = NgramsActionTypes.Load;
  constructor(public filters: NGramFilters) { }
}

export class NgramsLoadSuccessAction implements Action {
  readonly type = NgramsActionTypes.LoadSuccess;
  constructor(public ngramEntries: NGramEntry[]) { }
}

export class NgramsLoadErrorAction implements Action {
  readonly type = NgramsActionTypes.LoadFailure;
  constructor(public error: any) { }
}

export class NgramToggleKnownAction implements Action {
  readonly type = NgramsActionTypes.ToggleKnown;
  constructor(public nGramType: string, public id: string, public known: boolean) { }
}

export class NgramToggleKnownSuccessAction implements Action {
  readonly type = NgramsActionTypes.ToggleKnownSuccess;
  constructor(public id: string) { }
}

export class NgramToggleKnownErrorAction {
  readonly type = NgramsActionTypes.ToggleKnownFailure;
  constructor(public id: string, public error: any) { }
}

export type NgramsActions = NgramsLoadAction | NgramsLoadSuccessAction | NgramsLoadErrorAction |
  NgramToggleKnownAction | NgramToggleKnownSuccessAction | NgramToggleKnownErrorAction;
