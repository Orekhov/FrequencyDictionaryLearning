import { NGramFilters } from '../../types/types';

export interface MyDictFiltersState extends NGramFilters { }

export interface MyDictFeatureState {
    filters: MyDictFiltersState
}