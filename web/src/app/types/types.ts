export interface RawTextInput {
    sourceName: string;
    rawText: string;
}

export interface NGramEntry {
    item: string;
    known: boolean;
    totalCount: number;
}

export interface NGramFilters {
    type: string;
    known: string;
    limit: number;
}