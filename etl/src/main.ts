import { Command } from "commander";
import { configs, SourceFormat } from "./etl-configs";
import { AnkiTxtExtractor } from "./extract/ankitxt-extractor";

export async function start() {
    const program = new Command();

    program.option('-c, --config <value>', 'display help message');

    program.parse(process.argv);

    const activeConfiguration = configs.find((c) => c.id === program.config);
    if(activeConfiguration === undefined) {
        throw `configuration not found: ${program.config}`;
    }

    console.log(`Running ETL with the following config: ${activeConfiguration.description}`);

    if (activeConfiguration.sourceFormat === SourceFormat.AnkiTxt) {
        const extractor = new AnkiTxtExtractor();
        const corpus = await extractor.extract({
            filePath: activeConfiguration.sourceOptions.path,
            fieldNumber: activeConfiguration.sourceOptions.fieldNumber,
            known: activeConfiguration.known,
            NGramLength: 3
        });
        // load to DB
    };

    console.log('Finished');
}

