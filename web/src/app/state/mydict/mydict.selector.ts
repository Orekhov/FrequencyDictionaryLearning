import { createFeatureSelector } from '@ngrx/store';
import { mydictFeatureKey } from './mydict.feature';
import { MyDictFeatureState } from './mydict.states';

export const selectMyDictFeature = createFeatureSelector<MyDictFeatureState>(mydictFeatureKey);