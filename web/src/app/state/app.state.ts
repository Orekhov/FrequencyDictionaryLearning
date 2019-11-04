import { RawTextInputState } from './add.raw.reducer';
import { NgramListState } from './ngrams.reducer';

export interface AppState {
    addRaw: RawTextInputState,
    ngramList: NgramListState
}