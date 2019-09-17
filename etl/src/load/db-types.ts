export interface ICountDbEntry {
    s: number;
    c: number;
}

export class CountDbEntry implements ICountDbEntry {
    s: number;
    c: number;
    constructor(sourceNumber: number, count: number) {
        this.s = sourceNumber;
        this.c = count;
    }
}

export interface INGramDbEntry {
    item: string;
    known: boolean;
    updated: Date;
    totalCount: Number;
    counts: ICountDbEntry[];
}

export class NGramDbEntry implements INGramDbEntry {
    item: string;
    known: boolean;
    updated: Date;
    totalCount: Number;
    counts: CountDbEntry[];
    constructor(item: string, known: boolean, updated: Date, counts: CountDbEntry[]) {
        this.item = item;
        this.known = known;
        this.updated = updated;
        this.counts = counts;
        this.totalCount = counts[0].c;
    }
}

export interface ISourceIdentityDbEntry {
    sourceNumber: number;
    unigramsCount: number;
    description: string;
    length: number;
}

export class SourceIdentityDbEntry implements ISourceIdentityDbEntry {
    sourceNumber: number;
    unigramsCount: number;
    description: string;
    length: number;
    constructor(sourceNumber: number, unigramsCount: number, description: string, length: number) {
        this.sourceNumber = sourceNumber;
        this.unigramsCount = unigramsCount;
        this.description = description;
        this.length = length;
    }
}