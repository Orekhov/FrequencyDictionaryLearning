import { NGramDetailState } from './mydict.states';

export const nGramDetailInitialState: NGramDetailState = {
    ngram: {
        id: null,
        counts: null,
        item: null,
        known: null,
        totalCount: null
    },
    error: null,
    isSettingKnownState: false
};