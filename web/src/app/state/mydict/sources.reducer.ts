import { createReducer, on, Action } from '@ngrx/store';
import { SourcesState } from './mydict.states';
import * as SourcesActions from './sources.actions';
import { sourcesStateInitialState } from './sources.model';

const sourcesReducer = createReducer(
    sourcesStateInitialState,
    on(SourcesActions.loadSuccessAction, (state: SourcesState, action): SourcesState => ({ ...state, sources: action.sources.sources })),
);

export function reducer(state: SourcesState | undefined, action: Action) {
    return sourcesReducer(state, action);
}
