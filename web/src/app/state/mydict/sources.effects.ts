import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NgramService } from 'src/app/services/ngram.service';
import * as sourcesActions from './sources.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Source } from 'src/app/types/types';

@Injectable()
export class SourcesEffects {
  constructor(
    private actions$: Actions,
    private ngramsService: NgramService
  ) { }

  @Effect()
  loadNgram$ = this.actions$.pipe(
    ofType(sourcesActions.loadSourcesAction),
    mergeMap((action) => this.ngramsService.getSources()
      .pipe(
        map((sources: Source[]) => sourcesActions.loadSuccessAction({ sources: { sources } })),
        catchError(err => of(sourcesActions.loadFailureAction(err)))
      ))
  );
}
