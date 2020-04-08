import { createAction, props } from '@ngrx/store';

export const updateKnownAction = createAction(
    '[MyDictFilters] Display known updated',
    props<{ known: string }>()
);

export const updateTypeAction = createAction(
    '[MyDictFilters] Display type updated',
    props<{ nGramType: string }>()
);
