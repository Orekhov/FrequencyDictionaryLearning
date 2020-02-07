import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NgramService } from 'src/app/services/ngram.service';
import * as ngramActions from './ngram.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { NGramDetailEntry } from 'src/app/types/types';

@Injectable()
export class NGramDetailEffects {
  constructor(
    private actions$: Actions,
    private ngramsService: NgramService
  ) { }

  @Effect()
  loadNgram$ = this.actions$.pipe(
    ofType(ngramActions.loadNGramAction),
    mergeMap((action) => this.ngramsService.getNgramDetail(action.nGramType, action.id)
      .pipe(
        map((ngramDetail: NGramDetailEntry) => ngramActions.loadSuccessAction({ ngramDetail })),
        catchError(err => of(ngramActions.loadFailureAction(err)))
      ))
  );

  @Effect()
  changeKnownState = this.actions$.pipe(
    ofType(ngramActions.changeKnownState),
    mergeMap((action) => this.ngramsService.updateNgramKnownState(action.nGramType ,action.id, action.known)
      .pipe(
        map(() => ngramActions.changeKnownStateSuccess()),
        catchError(err => of(ngramActions.changeKnownStateFailure()))
      ))
  );
}
