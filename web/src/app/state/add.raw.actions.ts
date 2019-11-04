import { Action } from '@ngrx/store';
import { RawTextInput } from '../types/types';

export enum AddRawActionTypes {
    UpdateAddRawForm = '[Add raw] update form'
}

export class UpdateAddRawForm implements Action {
    readonly type = AddRawActionTypes.UpdateAddRawForm;
    constructor(public payload: RawTextInput) { }
}

export type AddRawActions = UpdateAddRawForm;