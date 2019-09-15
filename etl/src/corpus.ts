export class NGram {
    item: string;
    count: number;
    known: boolean;
    updated: Date;
    constructor(item: string, count: number, known: boolean, updated: Date) {
        this.item = item;
        this.count = count;
        this.known = known;
        this.updated = updated;
    }

    plusOne() {
        this.count += 1;
        this.updated = new Date(Date.now());
    }
}

export class UniGram extends NGram {

}

export class BiGram extends NGram {

}

export class TriGram extends NGram {

}

export class CorpusSourceIdentity {
    public description: string = "";
    public unigramsCount: number = NaN;
    public length: number = NaN;
}

export class Corpus {
    public unigrams: UniGram[] = [];
    public bigrams: BiGram[] = [];
    public trigrams: TriGram[] = [];
    public sourceIdentity: CorpusSourceIdentity = new CorpusSourceIdentity();

    addToken(token: string, known: boolean) {
        this.addNgram(token, known, this.unigrams);
    }

    addBigram(bigram: string, known: boolean) {
        this.addNgram(bigram, known, this.bigrams);
    }

    addTrigram(trigram: string, known: boolean) {
        this.addNgram(trigram, known, this.trigrams);
    }

    addNgram(ngram: string, known: boolean, ngrams: NGram[], ) {
        const existingNgram = ngrams.find(b => b.item === ngram);
        if (!existingNgram) {
            const newNgram = new NGram(ngram, 1, known, this.dateNow());
            ngrams.push(newNgram);
        } else {
            existingNgram.plusOne();
        }
    }

    private dateNow() {
        return new Date(Date.now());
    }
}