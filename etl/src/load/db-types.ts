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
    user: string;
    lang: string;
    known: boolean;
    updated: Date;
    totalCount: Number;
    counts: ICountDbEntry[];
}

export class NGramDbEntry implements INGramDbEntry {
    totalCount: Number;
    constructor(
        public item: string,
        public user: string,
        public lang: string,
        public known: boolean,
        public updated: Date,
        public counts: CountDbEntry[]) {
        this.totalCount = counts[0].c;
    }
}

export interface ISourceIdentityDbEntry {
    sourceNumber: number;
    user: string;
    lang: string;
    unigramsCount: number;
    bigramsCount: number;
    trigramsCount: number;
    description: string;
    charLength: number;
}

export class SourceIdentityDbEntry implements ISourceIdentityDbEntry {
    constructor(
        public sourceNumber: number,
        public user: string,
        public lang: string,
        public unigramsCount: number,
        public bigramsCount: number,
        public trigramsCount: number,
        public description: string,
        public charLength: number) { }
}