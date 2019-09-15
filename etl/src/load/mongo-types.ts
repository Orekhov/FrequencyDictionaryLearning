export class CountDbEntry {
    sN: number;
    c: number;
    constructor(sourceNumber: number, count: number) {
        this.sN = sourceNumber;
        this.c = count;
    }
}

export class NGramDbEntry {
    item: string;
    known: boolean;
    updated: Date;
    counts: CountDbEntry[];
    constructor(item: string, known: boolean, updated: Date, counts: CountDbEntry[]) {
        this.item = item;
        this.known = known;
        this.updated = updated;
        this.counts = counts;
    }
}

export class SourceIdentityDbEntry {
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