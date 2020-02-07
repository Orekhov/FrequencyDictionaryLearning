import { NGramFilters } from '../../types/types';
import { NGramDetailEntry } from '../../types/types';

export interface MyDictFiltersState extends NGramFilters { }

export interface NGramDetailState {
  ngram: NGramDetailEntry;
  error: any;
  isSettingKnownState: boolean;
}

export interface MyDictFeatureState {
  filters: MyDictFiltersState;
  ngramDetail: NGramDetailState;
}
