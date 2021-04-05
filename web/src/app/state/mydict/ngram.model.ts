import { NGramDetailState } from './mydict.states';

export const nGramDetailInitialState: NGramDetailState = {
    ngram: {
        id: null,
        counts: null,
        item: null,
        known: null,
        totalCount: null,
        totalCountFiltered: null,
        translations: null
    },
    error: null,
    isSettingKnownState: false
};
