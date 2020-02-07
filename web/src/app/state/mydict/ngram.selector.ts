import { createSelector } from '@ngrx/store';
import { selectMyDictFeature } from './mydict.selector';
import { nGramDetailInitialState } from './ngram.model';

export const nGramDetailSelector = createSelector(
    selectMyDictFeature,
    s => {
        if (s.ngramDetail) {
            return s.ngramDetail.ngram;
        }
        return nGramDetailInitialState.ngram;
    }
);

export const nGramDetailErrorSelector = createSelector(
    selectMyDictFeature,
    s => {
        if (s.ngramDetail) {
            return s.ngramDetail.error;
        }
        return nGramDetailInitialState.error;
    }
);

export const nGramChangingKnownState = createSelector(
    selectMyDictFeature,
    s => {
        if (s.ngramDetail) {
            return s.ngramDetail.isSettingKnownState;
        }
        return nGramDetailInitialState.isSettingKnownState;
    }
);