export interface RawTextInput {
  sourceName: string;
  rawText: string;
}

export interface NGramEntry {
  id: string;
  item: string;
  known: boolean;
  totalCount: number;
  totalCountFiltered: number;
}

export interface NGramDetailSource {
  sourceNumber: number;
  count: number;
  name: string;
  description: string;
}

export interface NGramDetailEntry extends NGramEntry {
  counts: NGramDetailSource[];
  translations: string[];
}

export interface NGramFilters {
  type: string;
  known: string;
  limit: number;
  sources: string[];
  search: string;
}

export interface Source {
  id: string;
  description: string;
}

export interface Sources {
  sources: Source[];
}

export interface SourceStats {
  uniqueCountTotal: number;
  uniqueCountKnown: number;
  uniqueCountKnownPct: number;
  uniqueCountUnknown: number;
  uniqueCountUnknownPct: number;
  frequencyCountTotal: number;
  frequencyCountKnown: number;
  frequencyCountKnownPct: number;
  frequencyCountUnknown: number;
  frequencyCountUnknownPct: number;
}
