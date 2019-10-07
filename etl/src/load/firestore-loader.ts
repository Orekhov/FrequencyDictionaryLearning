import { Corpus, UniGram, NGram, CorpusSourceIdentity } from "src/corpus";
import * as path from 'path';
import * as readline from 'readline';
import * as fs from 'fs-extra';
import { Firestore } from "@google-cloud/firestore";
import { NGramDbEntry, CountDbEntry, INGramDbEntry, SourceIdentityDbEntry } from "./db-types";
import { EtlConfig } from "src/etl-configs";

export class FirestoreLoader {

    // only clean load is supported, ensure clean DB as it won't be cleared.
    sourceNumber: number = 1;

    async load(corpus: Corpus, config: EtlConfig) {
        const db = await this.initDb(config.destOptions.serviceAccountKeyJsonPath);

        await this.loadNGram(db, config, 'unigrams', corpus.unigrams);
        await this.loadNGram(db, config, 'bigrams', corpus.bigrams);
        await this.loadNGram(db, config, 'trigrams', corpus.trigrams);
        await this.loadSourceIdentity(db, config, corpus.sourceIdentity);
    }

    private getCollection(db: Firestore, config: EtlConfig, collectionName: string) : FirebaseFirestore.CollectionReference {
        console.log(`Populating ${collectionName}`);
        return db.collection(collectionName);
    }

    private async loadNGram(db: Firestore, config: EtlConfig, collectionRootName: string, ngrams: NGram[]) {
        const collectionReference = this.getCollection(db, config, collectionRootName);

        const ngramsDb: INGramDbEntry[] = ngrams.map(n => {
            return <INGramDbEntry>{
                item: n.item,
                user: config.userId,
                lang: config.language,
                known: n.known,
                updated: n.updated,
                totalCount: n.count,
                counts: [{ s: this.sourceNumber, c: n.count }]
            };
        });
        const itemCount = ngramsDb.length;
        for (let i = 0; i < itemCount; i++) {
            const nGramDbEntry = ngramsDb[i];
            try {
                await collectionReference.add(nGramDbEntry);
            } catch (error) {
                console.warn(`Could not add ${nGramDbEntry.item}`);
                console.warn('Error message is:');
                console.warn(error.message);
            }
            this.reportProgress(i, itemCount);
        }
    }

    private reportProgress(current:number, total:number) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Added ${current} of ${total}`);
    }

    private async initDb(serviceAccountKeyJsonPath: string) {
        const resolvedFilePath = path.resolve(serviceAccountKeyJsonPath);
        const serviceAccountKeyJson = await fs.readJson(resolvedFilePath);
        return new Firestore({
            projectId: serviceAccountKeyJson.project_id,
            keyFilename: resolvedFilePath,
        });
    }

    private async loadSourceIdentity(db: Firestore, config: EtlConfig, sourceIdentity: CorpusSourceIdentity) {
        const collectionName = `sources`;
        console.log(`Populating ${collectionName}`);
        const collectionReference =  db.collection(collectionName);
        const sourceIdentityDb: SourceIdentityDbEntry = {
            sourceNumber: this.sourceNumber,
            user: config.userId,
            lang: config.language,
            description: sourceIdentity.description,
            unigramsCount: sourceIdentity.unigramsCount,
            bigramsCount: sourceIdentity.bigramsCount,
            trigramsCount: sourceIdentity.trigramsCount,
            charLength: sourceIdentity.charLength
        };
        try {
            await collectionReference.add(sourceIdentityDb);
        } catch (error) {
            console.warn(error.message);
        }
    }
}