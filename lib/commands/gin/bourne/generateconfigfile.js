"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@salesforce/command");
const kit_1 = require("@salesforce/kit");
const core_1 = require("@salesforce/core");
class GenerateConfigFile extends command_1.SfdxCommand {
    async run() {
        await this.generateConfigFile();
    }
    async generateConfigFile() {
        const metadataBourneInfo = await this.org.getConnection().query(`
        SELECT Id, ImportRetries__c, MaxPollCount__c, PayloadLength__c, PollBatchSize__c, UseManagedPackage__c, PollTimeout__c,
        (
            SELECT Id, Label, CleanupFields__c, Directory__c, ExternalId__c, Query__c, EnableMultithreading__c, HasRecordTypes__c
            FROM BourneSObjects__r
        )
        FROM BourneConfig__mdt
    `);
        if (!metadataBourneInfo.totalSize) {
            throw new core_1.SfdxError("No BourneConfig record found. Please generate them before running this command");
        }
        const record = metadataBourneInfo.records[0];
        this.ux.startSpinner("start generating config file");
        const fileJson = {
            pollTimeout: record.PollTimeout__c,
            pollBatchSize: record.PollBatchSize__c,
            maxPollCount: record.MaxPollCount__c,
            payloadLength: record.PayloadLength__c,
            importRetries: record.ImportRetries__c,
            useManagedPackage: record.UseManagedPackage__c,
            allObjects: record.BourneSObjects__r.records.map((_) => _.Label),
            objects: record.BourneSObjects__r.records.reduce((acc, _) => Object.assign(acc, {
                [_.Label]: {
                    query: _.Query__c,
                    externalid: _.ExternalId__c,
                    directory: _.Directory__c,
                    cleanupFields: JSON.parse(_.CleanupFields__c),
                    enableMultiThreading: _.EnableMultithreading__c,
                    hasRecordTypes: _.HasRecordTypes__c,
                },
            }), {}),
        };
        await core_1.fs.writeFile(`./scripts/cpq-export-template.json`, JSON.stringify(fileJson, null, 2));
    }
}
exports.default = GenerateConfigFile;
GenerateConfigFile.description = "Generates Bourne Config file based on Custom Metadata Type Records on the org";
GenerateConfigFile.examples = [
    `$ sfdx gin:bourne:generateconfigfile" 
    config file generated
    `,
];
GenerateConfigFile.flagsConfig = {
    timeout: command_1.flags.minutes({
        char: "t",
        description: "During in minutes before command fails",
        required: false,
        default: kit_1.Duration.minutes(1),
    }),
};
GenerateConfigFile.requiresUsername = true;
GenerateConfigFile.requiresDevhubUsername = false;
GenerateConfigFile.requiresProject = false;
//# sourceMappingURL=generateconfigfile.js.map