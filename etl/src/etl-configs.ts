export interface EtlConfig {
    id: string,
    description: string,
    sourceFormat: SourceFormat,
    sourceOptions: any,
    dest: Destination,
    known: boolean
}

export enum SourceFormat {
    AnkiTxt
}

export enum Destination {
    Mongo
}

export const configs: EtlConfig[] = [
    {
        id: "a2m",
        description: "Anki text file to mongo db",
        sourceFormat: SourceFormat.AnkiTxt,
        sourceOptions: {
            path: "anki.txt",
            fieldNumber: 0
        },
        dest: Destination.Mongo,
        known: true
    }
]

