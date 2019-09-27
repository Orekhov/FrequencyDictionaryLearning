export interface EtlConfig extends EtlConfigCore {
    userId: string,
    language: string
}

export interface EtlConfigCore {
    id: string,
    description: string,
    sourceFormat: SourceFormat,
    sourceOptions: any,
    dest: Destination,
    destOptions: any,
    known: boolean
}

export enum SourceFormat {
    AnkiTxt
}

export enum Destination {
    Mongo,
    Firestore
}

export const configs: EtlConfigCore[] = [
    {
        id: "a2m",
        description: "Anki text file to mongo db",
        sourceFormat: SourceFormat.AnkiTxt,
        sourceOptions: {
            path: "anki.txt",
            fieldNumber: 0
        },
        dest: Destination.Mongo,
        destOptions: {},
        known: true
    }, 
    {
        id: "a2cf",
        description: "Anki text file to google cloud firestore",
        sourceFormat: SourceFormat.AnkiTxt,
        sourceOptions: {
            path: "anki.txt",
            fieldNumber: 0
        },
        dest: Destination.Firestore,
        destOptions: {
            serviceAccountKeyJsonPath: "serviceAccountKey.json"
        },
        known: true
    }
]

