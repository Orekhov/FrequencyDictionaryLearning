import { Corpus, NGram, UniGram, BiGram, TriGram, CorpusSourceIdentity } from '../corpus';
import { MongoClient, Db, Collection } from 'mongodb';
import { NGramDbEntry, CountDbEntry, SourceIdentityDbEntry } from './db-types';

const url = 'mongodb://localhost:27017';
const dbName = 'FDL';


export class MongoLoader {

    // only clean load is supported
    sourceNumber: number = 1;

    async load(corpus: Corpus) {
        const client = await this.initClient(url);
        const db = client.db(dbName);
        await this.loadUnigrams(db, corpus.unigrams);
        await this.loadBigrams(db, corpus.bigrams);
        await this.loadTrigrams(db, corpus.trigrams);
        await this.loadSourceIdentity(db, corpus.sourceIdentity);

        await client.close();
    }

    private async loadUnigrams(db: Db, unigrams: UniGram[]) {
        const collection = db.collection('unigrams');
        await this.loadNGram(collection, unigrams);
    }

    private async loadBigrams(db: Db, bigrams: BiGram[]) {
        const collection = db.collection('bigrams');
        await this.loadNGram(collection, bigrams);
    }

    private async loadTrigrams(db: Db, trigrams: TriGram[]) {
        const collection = db.collection('trigrams');
        await this.loadNGram(collection, trigrams);
    }

    private async loadNGram(collection: Collection, ngrams: NGram[]) {
        await this.clearCollection(collection);
        const ngramsDb: NGramDbEntry[] = ngrams.map(n => {
            return new NGramDbEntry(n.item, "", "", n.known, n.updated, [new CountDbEntry(this.sourceNumber, n.count)]);
        })
        await collection.insertMany(ngramsDb);
    }

    private async loadSourceIdentity(db: Db, cid: CorpusSourceIdentity) {
        const collection = db.collection('source-ids');
        await this.clearCollection(collection);
        const sourceIdDbEntry = new SourceIdentityDbEntry(
            this.sourceNumber, 
            "",
            "",
            cid.unigramsCount, 
            cid.bigramsCount,
            cid.trigramsCount,
            cid.description, 
            cid.charLength);
        await collection.insertOne(sourceIdDbEntry);
    }

    private async initClient(url: string): Promise<MongoClient> {
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        return await client.connect();
    }

    private async clearCollection(collection: Collection) {
        const st = await collection.stats();
        if (st.count > 0) {
            await collection.drop();
        }
    }

}