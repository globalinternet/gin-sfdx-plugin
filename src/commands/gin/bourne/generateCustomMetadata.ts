import { flags, SfdxCommand } from "@salesforce/command";
import { Duration } from "@salesforce/kit";
import { SfdxError } from "@salesforce/core";
import * as fs from "fs";

export default class GenerateCustomMetadataFile extends SfdxCommand {
  public static description =
    "Waits until all Permission Set Groups are updated";

  public static examples = [
    `$ sfdx gin:sharing:waitReady" 
    all permission set groups were successfully updated
    `,
  ];

  protected static flagsConfig = {
    timeout: flags.minutes({
      char: "t",
      description: "During in minutes before command fails",
      required: false,
      default: Duration.minutes(1),
    }),
  };
  protected static requiresUsername = false;
  protected static requiresDevhubUsername = false;
  protected static requiresProject = true;

  public async run(): Promise<any> {
    await this.generateConfigFile();
  }

  private async generateConfigFile() {
    const fileName = "./scripts/cpq-export-template.json";
    const data = await new Promise((resolve, reject) =>
      fs.readFile(fileName, (err, data) => (err ? reject(err) : resolve(data)))
    ).then((_: string) => JSON.parse(_));

    // console.log(data);
    const files = [];
    const projectConfig = await this.project.resolveProjectConfig();
    const packageFolder = (<any[]>projectConfig.packageDirectories).find(_ => _.default);
    const cmtFolder = packageFolder.path + '/main/default/customMetadata';

    const doesExist = await new Promise((resolve, reject) => fs.exists(cmtFolder, resolve.bind(this)));
    if (!doesExist) {
      throw new SfdxError(`${cmtFolder} does not exist. Please create this folder for Custom Metadata`);
    }

    files.push(this.buildBourneConfigFile(cmtFolder, data));
    Object.entries(data.objects)
      .forEach(([sObjectName, sObjectData]) => files.push(this.buildBourneSObjectFile(cmtFolder, sObjectName, sObjectData)))

    this.ux.startSpinner(`start creating ${files.length} files`);
    await Promise.all(files.map(file => new Promise((resolve, reject) => 
      fs.writeFile(file.name, file.body, err=> 
        err ? reject(err) : (this.ux.log(`created ${file.name}`), resolve())))));
    this.ux.stopSpinner(`successfully created ${files.length} files`);
  }

  buildBourneSObjectFile(cmtFolderPath, sObjectName, data) {
    return {
      name: `${cmtFolderPath}/BourneSObject.${sObjectName.replace(/__(?=.+__c)/, '').replace(/__c$/, '')}.md-meta.xml`,
      body:
`
<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>${sObjectName}</label>
    <protected>false</protected>
    <values>
        <field>BourneConfig__c</field>
        <value xsi:type="xsd:string">Default</value>
    </values>
    <values>
        <field>CleanupFields__c</field>
        <value xsi:type="xsd:string">${JSON.stringify(data.cleanupFields)}</value>
    </values>
    <values>
        <field>Directory__c</field>
        <value xsi:type="xsd:string">${data.directory|| ''}</value>
    </values>
    <values>
        <field>EnableMultithreading__c</field>
        <value xsi:type="xsd:boolean">${data.enableMultiThreading || false}</value>
    </values>
    <values>
        <field>ExternalId__c</field>
        <value xsi:type="xsd:string">${data.externalId || ''}</value>
    </values>
    <values>
        <field>HasRecordTypes__c</field>
        <value xsi:type="xsd:boolean">${data.hasRecordTypes || false}</value>
    </values>
    <values>
        <field>Query__c</field>
        <value xsi:type="xsd:string">${data.query}</value>
    </values>
</CustomMetadata>
`.trim()
    }
  }
  buildBourneConfigFile(cmtFolderPath, data) {
    return {
      name: `${cmtFolderPath}/BourneConfig.Default.md-meta.xml`,
      body: 
`
<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>Default</label>
    <protected>false</protected>
    <values>
        <field>ImportRetries__c</field>
        <value xsi:type="xsd:double">${data.importRetries || 3}</value>
    </values>
    <values>
        <field>MaxPollCount__c</field>
        <value xsi:type="xsd:double">${data.maxPollCount || 0}</value>
    </values>
    <values>
        <field>PayloadLength__c</field>
        <value xsi:type="xsd:double">${data.payloadLength || 250000}</value>
    </values>
    <values>
        <field>PollBatchSize__c</field>
        <value xsi:type="xsd:string">${data.pollBatchSize || 1}</value>
    </values>
    <values>
        <field>PollTimeout__c</field>
        <value xsi:type="xsd:double">${data.pollTimeout || 10}</value>
    </values>
    <values>
        <field>UseManagedPackage__c</field>
        <value xsi:type="xsd:boolean">${data.useManagedPackage || false}</value>
    </values>
</CustomMetadata>
`.trim()
    };
  }
}
