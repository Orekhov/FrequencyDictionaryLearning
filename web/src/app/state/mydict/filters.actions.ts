import { createAction, props } from '@ngrx/store';

export const updateKnownAction = createAction(
    '[MyDictFilters] Display known updated',
    props<{ known: string }>()
);
