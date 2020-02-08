import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  NgramsActionTypes,
  NgramsLoadAction,
  NgramsLoadSuccessAction,
  NgramsLoadErrorAction, NgramToggleKnownAction,
  NgramToggleKnownSuccessAction,
  NgramToggleKnownErrorAction
} from './ngrams.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { NgramService } from '../services/ngram.service';
import { NGramEntry } from '../types/types';
import { of } from 'rxjs';


@Injectable()
export class NGramsEffects {

  constructor(private actions$: Actions, private ngramsService: NgramService) { }

  @Effect()
  loadNgrams$ = this.actions$.pipe(
    ofType(NgramsActionTypes.Load),
    mergeMap((action: NgramsLoadAction) => this.ngramsService.getNgrams(action.filters)
      .pipe(
        map((ngrams: NGramEntry[]) => new NgramsLoadSuccessAction(ngrams)),
        catchError(err => of(new NgramsLoadErrorAction(err)))
      ))
  );

  @Effect()
  toggleNgramKnown$ = this.actions$.pipe(
    ofType(NgramsActionTypes.ToggleKnown),
    mergeMap((action: NgramToggleKnownAction) => this.ngramsService.updateNgramKnownState(action.nGramType, action.id, action.known)
      .pipe(
        map(() => new NgramToggleKnownSuccessAction(action.id)),
        catchError(err => of(new NgramToggleKnownErrorAction(action.id, err)))
      ))
  );

}
