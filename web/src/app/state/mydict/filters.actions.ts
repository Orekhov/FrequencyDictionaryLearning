import { createAction, props } from '@ngrx/store';

export const updateKnownAction = createAction(
    '[MyDictFilters] Display known updated',
    props<{ known: string }>()
);

export const updateTypeAction = createAction(
    '[MyDictFilters] Display type updated',
    props<{ nGramType: string }>()
);

export const updateSourcesAction = createAction(
    '[MyDictFilters] Display sources updated',
    props<{ sources: string[] }>()
)

export const updateSearchAction = createAction(
    '[MyDictFilters] Search updated',
    props<{ search: string }>()
)
