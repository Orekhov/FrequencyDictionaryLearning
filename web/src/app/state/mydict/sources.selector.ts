import { createSelector } from '@ngrx/store';
import { selectMyDictFeature } from './mydict.selector';
import { sourcesStateInitialState } from './sources.model';

export const sourcesSelector = createSelector(
    selectMyDictFeature,
    s => {
        if (s.sources) {
            return s.sources.sources;
        }
        return sourcesStateInitialState.sources;
    }
);