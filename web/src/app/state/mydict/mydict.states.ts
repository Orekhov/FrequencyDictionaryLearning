import { NGramFilters } from '../../types/types';
import { NGramDetailEntry } from '../../types/types';

export interface MyDictFiltersState extends NGramFilters { }

export interface NGramDetailState extends NGramDetailEntry { }

export interface MyDictFeatureState {
  filters: MyDictFiltersState;
  ngramDetailed: NGramDetailState;
}
