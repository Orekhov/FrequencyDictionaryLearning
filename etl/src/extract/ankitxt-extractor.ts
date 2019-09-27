import * as fs from 'fs-extra';
import * as path from 'path';
import { Corpus, NGram } from '../corpus';

interface AnkiTxtExtractParams {
    filePath: string,
    fieldNumber: number
    known: boolean,
    NGramLength: number
}

export class AnkiTxtExtractor {
    public async extract(params: AnkiTxtExtractParams) : Promise<Corpus> {
        const corpus = new Corpus();

        const ankiDeckTxt = await this.readFromFile(params.filePath);
        let ankiNotes = this.getAnkiNotes(ankiDeckTxt);
        let sourceLength = 0;

        ankiNotes.forEach(ankiNote => {
            const tabChar = String.fromCharCode(9);
            const ankiField = ankiNote.split(tabChar)[params.fieldNumber];
            const ankiFieldTokens = this.tokenize(ankiField);
            ankiFieldTokens.forEach(token => {
                corpus.addToken(token, params.known);
            });
            const ankiFieldBigrams = this.buildBigrams(ankiFieldTokens);
            ankiFieldBigrams.forEach(bigram => {
                corpus.addBigram(bigram, params.known);
            });
            const ankiFieldTrigrams = this.buildTrigrams(ankiFieldTokens);
            ankiFieldTrigrams.forEach(trigram => {
                corpus.addTrigram(trigram, params.known);
            });
            sourceLength += ankiField.length;
        });
        corpus.sourceIdentity.description = "Loaded from anki deck";
        corpus.sourceIdentity.charLength = sourceLength;
        corpus.sourceIdentity.unigramsCount = corpus.unigrams.length;
        corpus.sourceIdentity.bigramsCount = corpus.bigrams.length;
        corpus.sourceIdentity.trigramsCount = corpus.trigrams.length;

        corpus.unigrams = corpus.unigrams.sort(this.sortDesc);
        corpus.bigrams = corpus.bigrams.sort(this.sortDesc);
        corpus.trigrams = corpus.trigrams.sort(this.sortDesc);
        return corpus;
    }

    private sortDesc(a: NGram, b: NGram): number {
        if (a.count === b.count) {
            return 0;
        }
        return a.count > b.count ? -1 : 1;
    }

    private tokenize(str: string): string[] {
        /* Testing strings:
        Han er fra Sør-Amerika.
        Nord- og Sør-Trøndelag og Vest- og Aust-Agder er fire av Norges nitten fylker. 
        Den ene mynten var en 10-øring. 
        I årets kommunevalg fikk Venstre et valgresultat på 3,9 prosent. 
        Jeg gjorde ingenting med saken – og det burde det ikke være så vanskelig å forstå.
        Jeg er 27 år gammel. */
        const allTokens = str.split(/[^0-9A-Za-z_æøåÆØÅäÄöÖüÜ\-]+/);
        return allTokens.filter(t => {
            return t !== "";
        }).map(t => {
            return t.toLowerCase();
        })
    }

    private buildBigrams(tokens: string[]) {
        return this.buildNgrams(tokens, 2);
    }

    private buildTrigrams(tokens: string[]) {
        return this.buildNgrams(tokens, 3);
    }

    private buildNgrams(tokens: string[], n: number) {
        let ngrams: string[] = [];
        const stopAt = tokens.length - n + 1;
        if (tokens.length >= n) {
            for (let i = 0; i < stopAt; i++) {
                let ngram = ""
                for (let j = 0; j < n; j++) {
                    if (j > 0) {
                        ngram = ngram + " "
                    }
                    ngram = ngram + tokens[i + j];
                }
                ngrams.push(ngram);
            }
        }
        return ngrams;
    }

    private async readFromFile(filePath: string): Promise<string> {
        const resolvedFilePath = path.resolve(filePath);
        const fileBuffer = await fs.readFile(resolvedFilePath);
        return fileBuffer.toString();
    }

    private getAnkiNotes(ankiDeckTxt: string): string[] {
        const lineBreakChar = String.fromCharCode(10);
        return ankiDeckTxt.split(lineBreakChar);
    }

}