import { Action } from '@ngrx/store';
import { NGramEntry, NGramFilters } from '../types/types';

export enum NgramsActionTypes {
    Load = '[Ngrams] Load',
    LoadSuccess = '[Ngrams] Load success',
    LoadFailure = '[Ngrams] Load failure'
}

export class NgramsLoadAction implements Action {
    readonly type = NgramsActionTypes.Load;
    constructor(public filters: NGramFilters) {}
}

export class NgramsLoadSuccessAction implements Action {
    readonly type = NgramsActionTypes.LoadSuccess
    constructor(public ngramEntries: NGramEntry[]) {}
}

export class NgramsLoadErrorAction implements Action {
    readonly type = NgramsActionTypes.LoadFailure
    constructor(public error: any) {}
}

export type NgramsActions = NgramsLoadAction | NgramsLoadSuccessAction | NgramsLoadErrorAction;