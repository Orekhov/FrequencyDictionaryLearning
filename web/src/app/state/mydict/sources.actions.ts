import { createAction, props } from '@ngrx/store';
import { Sources } from '../../types/types';

export const loadSourcesAction = createAction(
    '[Sources] Load',
    props<{ lang: string }>()
);

export const loadSuccessAction = createAction(
    '[Sources] Load Success',
    props<{ sources: Sources }>()
);

export const loadFailureAction = createAction(
    '[Sources] Load Failure',
    props<{ error: any }>()
);