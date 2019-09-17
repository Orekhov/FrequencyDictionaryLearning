import { Command } from "commander";
import { configs, SourceFormat, EtlConfig, Destination } from "./etl-configs";
import { AnkiTxtExtractor } from "./extract/ankitxt-extractor";
import { Corpus } from "./corpus";
import { MongoLoader } from "./load/mongo-loader";
import { FirestoreLoader } from "./load/firestore-loader";

export async function start() {
    try {
        const activeConfiguration = loadConfiguration();
        await etl(activeConfiguration);
        console.log('Finished.');
    } catch (error) {
        console.error(`Error occured.`);
        console.error(error);
    }
}

function loadConfiguration(): EtlConfig {
    const program = new Command();
    program.option('-c, --config <value>', 'display help message');
    program.parse(process.argv);

    const activeConfiguration = configs.find((c) => c.id === program.config);
    if (activeConfiguration === undefined) {
        throw `configuration not found: ${program.config}`;
    }

    console.log(`Running ETL with the following config: ${activeConfiguration.description}`);
    return activeConfiguration;
}

async function etl(activeConfiguration: EtlConfig) {
    const corpus = await extract(activeConfiguration);
    await load(activeConfiguration, corpus);
}

async function extract(activeConfiguration: EtlConfig): Promise<Corpus> {
    if (activeConfiguration.sourceFormat === SourceFormat.AnkiTxt) {
        const extractor = new AnkiTxtExtractor();
        return await extractor.extract({
            filePath: activeConfiguration.sourceOptions.path,
            fieldNumber: activeConfiguration.sourceOptions.fieldNumber,
            known: activeConfiguration.known,
            NGramLength: 3
        });
    }
    throw `Unknown source format: ${activeConfiguration.sourceFormat}`;
}

async function load(activeConfiguration: EtlConfig, corpus: Corpus) {
    if (activeConfiguration.dest === Destination.Mongo) {
        const loader = new MongoLoader();
        await loader.load(corpus);
    } else if(activeConfiguration.dest === Destination.Firestore) {
        const loader = new FirestoreLoader();
        await loader.load(corpus, activeConfiguration.destOptions);
    } else {
        throw `Unknown dest format: ${activeConfiguration.dest}`;
    }
}
