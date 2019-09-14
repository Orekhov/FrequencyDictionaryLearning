import { Command } from "commander";
import { configs, SourceFormat } from "./etl-configs";
import { AnkiTxtExtractor } from "./ankitxt-extractor";

export function start() {
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
        extractor.extract({
            filePath: activeConfiguration.sourceOptions.path,
            known: activeConfiguration.known,
            NGramLength: 3
        })
    };

    console.log('Finished');
}

