import { flags, SfdxCommand } from '@salesforce/command';
import { fs } from '@salesforce/core';
import { runInThisContext } from 'vm';

export default class GenerateCustomMetadataFile extends SfdxCommand {
  public static description =
    'Waits until all Permission Set Groups are updated';

  public static examples = [
    `$ sfdx gin:bourne:generatecustommetadata
    custom metadata generated
    `
  ];

  protected static flagsConfig = {
    bournefile: flags.filepath({
      char: 'f',
      description: 'file path to generate CMT from',
      required: false,
      default: './scripts/cpq-export-template.json'
    }),
    bournesettingname: flags.string({
      char: 's',
      description: 'Describes what Bourne Settings to use',
      default: 'Default'
    })
  };
  protected static requiresUsername = false;
  protected static requiresDevhubUsername = false;
  protected static requiresProject = true;

  public async run(): Promise<any> {
    await this.generateConfigFile();
  }

  buildBourneSObjectFile(cmtFolderPath, sObjectName, data, index) {
    let itemName: string = `${sObjectName.replace(/__(?=.+__c)/, '').replace(/__c$/, '').replace(/[ _]/g,'')}`;
    if (this.flags.bournesettingname !== 'Default') {
      itemName = this.flags.bournesettingname + '_' + itemName;
    }
    return {
      name: `${cmtFolderPath}/BourneSettingItem.${itemName}.md-meta.xml`,
      body:
`
<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>${sObjectName}</label>
    <protected>false</protected>
    <values>
        <field>BourneSetting__c</field>
        <value xsi:type="xsd:string">${this.flags.bournesettingname}</value>
    </values>
    <values>
        <field>CleanupFields__c</field>
        <value xsi:type="xsd:string">${JSON.stringify(data.cleanupFields)}</value>
    </values>
    <values>
        <field>Directory__c</field>
        <value xsi:type="xsd:string">${data.directory || ''}</value>
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
    <values>
        <field>Sequence__c</field>
        <value xsi:type="xsd:string">${10 * (index + 1)}</value>
    </values>
</CustomMetadata>
`.trim()
    };
  }
  public buildBourneConfigFile(cmtFolderPath, data) {
    return {
      name: `${cmtFolderPath}/BourneSetting.${this.flags.bournesettingname}.md-meta.xml`,
      body: 
`
<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>${this.flags.bournesettingname}</label>
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

  private async generateConfigFile() {
    const data = await fs.readFile(this.flags.bournefile)
      .then(data => JSON.parse(data.toString('utf-8')));
    const files = [];
    const projectConfig = await this.project.resolveProjectConfig();
    const packageFolder = (projectConfig.packageDirectories as any[]).find(_ => _.default);
    const cmtFolder = packageFolder.path + '/main/default/customMetadata';

    files.push(this.buildBourneConfigFile(cmtFolder, data));
    Object.entries(data.objects)
      .forEach(([sObjectName, sObjectData], index) => files.push(this.buildBourneSObjectFile(cmtFolder, sObjectName, sObjectData, index)));

    this.ux.startSpinner(`start creating ${files.length} files`);
    await Promise.all(files.map(file =>  fs.writeFile(file.name, file.body)));
    this.ux.stopSpinner(`successfully created ${files.length} files`);
  }
}
