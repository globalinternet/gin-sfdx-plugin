import { flags, SfdxCommand } from "@salesforce/command";
import { SfdxError, fs } from "@salesforce/core";

export default class GenerateCustomMetadataFile extends SfdxCommand {
  public static description =
    "Waits until all Permission Set Groups are updated";

  public static examples = [
    `$ sfdx gin:bourne:generatecustommetadata 
    custom metadata generated
    `,
  ];

  protected static flagsConfig = {};
  protected static requiresUsername = false;
  protected static requiresDevhubUsername = false;
  protected static requiresProject = true;

  public async run(): Promise<any> {
    await this.generateConfigFile();
  }

  private async generateConfigFile() {
    const fileName = "./scripts/cpq-export-template.json";
    const data = await fs.readFile(fileName)
      .then(data => JSON.parse(data.toString('utf-8')));
    const files = [];
    const projectConfig = await this.project.resolveProjectConfig();
    const packageFolder = (<any[]>projectConfig.packageDirectories).find(_ => _.default);
    const cmtFolder = packageFolder.path + '/main/default/customMetadata';

    files.push(this.buildBourneConfigFile(cmtFolder, data));
    Object.entries(data.objects)
      .forEach(([sObjectName, sObjectData]) => files.push(this.buildBourneSObjectFile(cmtFolder, sObjectName, sObjectData)))

    this.ux.startSpinner(`start creating ${files.length} files`);
    await Promise.all(files.map(file =>  fs.writeFile(file.name, file.body)));
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
        <value xsi:type="xsd:string">${data.externalid || ''}</value>
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
