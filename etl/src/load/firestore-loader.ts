import { Corpus, UniGram, NGram } from "src/corpus";
import * as path from 'path';
import * as fs from 'fs-extra';
import { Firestore } from "@google-cloud/firestore";
import { NGramDbEntry, CountDbEntry, INGramDbEntry } from "./db-types";

export class FirestoreLoader {

    // only clean load is supported, ensure clean DB as it won't be cleared.
    sourceNumber: number = 1;

    async load(corpus: Corpus, config: any) {
        const db = await this.initDb(config.serviceAccountKeyJsonPath);

        // this.loadUnigrams(db, corpus.unigrams);
    }

    private async loadUnigrams(db: Firestore, unigrams: UniGram[]) {
        const collection = db.collection('unigrams');
        await this.loadNGram(collection, unigrams);
    }

    private async loadNGram(collectionReference: FirebaseFirestore.CollectionReference, ngrams: NGram[]) {
        const ngramsDb: INGramDbEntry[] = ngrams.map(n => {
            return <INGramDbEntry>{
                item: n.item,
                known: n.known,
                updated: n.updated,
                totalCount: n.count,
                counts: [{ s: this.sourceNumber, c: n.count }]
            };
        })
        const itemCount = ngramsDb.length;
        for (let i = 0; i < itemCount; i++) {
            const nGramDbEntry = ngramsDb[i];
            await collectionReference.doc(nGramDbEntry.item).set(nGramDbEntry);
            if (i % 10 === 0) {
                console.log(`Added ${i} of ${itemCount} items`);
            }
        }
    }

    private async initDb(serviceAccountKeyJsonPath: string) {
        const resolvedFilePath = path.resolve(serviceAccountKeyJsonPath);
        const serviceAccountKeyJson = await fs.readJson(resolvedFilePath);
        return new Firestore({
            projectId: serviceAccountKeyJson.project_id,
            keyFilename: resolvedFilePath,
        });
    }
}