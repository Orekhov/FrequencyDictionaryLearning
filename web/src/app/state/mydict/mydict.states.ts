import { NGramFilters, Source } from '../../types/types';
import { NGramDetailEntry } from '../../types/types';
import { Sources } from '../../types/types';

export interface MyDictFiltersState extends NGramFilters { }

export interface NGramDetailState {
  ngram: NGramDetailEntry;
  error: any;
  isSettingKnownState: boolean;
}

export interface SourcesState extends Sources { }

export interface MyDictFeatureState {
  filters: MyDictFiltersState;
  sources: SourcesState;
  ngramDetail: NGramDetailState;
}