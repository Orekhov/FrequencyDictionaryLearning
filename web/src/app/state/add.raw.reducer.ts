import { RawTextInput } from '../types/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AddRawActions, AddRawActionTypes } from './add.raw.actions';

export interface RawTextInputState extends RawTextInput { }

const initialState: RawTextInputState = {
    sourceName: '',
    rawText: ''
}

const getRawTextInputStateSelector = createFeatureSelector<RawTextInputState>('addRaw');

export const getRawTextInputState = createSelector(
    getRawTextInputStateSelector,
    state => state
);

export function addRawReducer(state: RawTextInputState = initialState, action: AddRawActions): RawTextInputState {
    switch (action.type) {
        case AddRawActionTypes.UpdateAddRawForm:
            return {
                ...state,
                rawText: action.payload.rawText,
                sourceName: action.payload.sourceName
            };
        default:
            return state;
    }
}