interface AnkiTxtExtracParams {
    filePath: string,
    known: boolean,
    NGramLength: number
}

export class AnkiTxtExtractor {
    public extract(params: AnkiTxtExtracParams) {
        console.log(params);
    }
}