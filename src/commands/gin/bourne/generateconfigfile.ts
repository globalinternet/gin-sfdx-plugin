import { flags, SfdxCommand } from "@salesforce/command";
import { SfdxError, fs } from "@salesforce/core";

export default class GenerateConfigFile extends SfdxCommand {
  public static description =
    "Generates Bourne Config file based on Custom Metadata Type Records on the org";

  public static examples = [
    `$ sfdx gin:bourne:generateconfigfile" 
    config file generated
    `,
  ];

  protected static flagsConfig = {
    bournefile: flags.filepath({
      char: 'f',
      description: 'file name to generate',
      required: false,
      default: './scripts/cpq-export-template.json'
    })
  };
  protected static requiresUsername = true;
  protected static requiresDevhubUsername = false;
  protected static requiresProject = true;

  public async run(): Promise<any> {
    await this.generateConfigFile();
  }

  private async generateConfigFile() {
    const metadataBourneInfo = await this.org.getConnection().query(`
        SELECT Id, ImportRetries__c, MaxPollCount__c, PayloadLength__c, PollBatchSize__c, UseManagedPackage__c, PollTimeout__c,
        (
            SELECT Id, Label, CleanupFields__c, Directory__c, ExternalId__c, Query__c, EnableMultithreading__c, HasRecordTypes__c
            FROM BourneSettingItems__r
        )
        FROM BourneSetting__mdt
    `);

    if (!metadataBourneInfo.totalSize) {
      throw new SfdxError(
        "No BourneConfig record found. Please generate them before running this command"
      );
    }

    const record: any = metadataBourneInfo.records[0];
    this.ux.startSpinner("start generating config file");
    const fileJson = {
      pollTimeout: record.PollTimeout__c,
      pollBatchSize: record.PollBatchSize__c,
      maxPollCount: record.MaxPollCount__c,
      payloadLength: record.PayloadLength__c,
      importRetries: record.ImportRetries__c,
      useManagedPackage: record.UseManagedPackage__c,
      allObjects: record.BourneSettingItems__r.records.map((_) => _.Label),
      objects: record.BourneSettingItems__r.records.reduce(
        (acc, _) =>
          Object.assign(acc, {
            [_.Label]: {
              query: _.Query__c,
              externalid: _.ExternalId__c,
              directory: _.Directory__c,
              cleanupFields: JSON.parse(_.CleanupFields__c),
              enableMultiThreading: _.EnableMultithreading__c,
              hasRecordTypes: _.HasRecordTypes__c,
            },
          }),
        {}
      ),
    };

    await fs.writeFile(
      this.flags.bournefile,
      JSON.stringify(fileJson, null, 2)
    );
  }
}
