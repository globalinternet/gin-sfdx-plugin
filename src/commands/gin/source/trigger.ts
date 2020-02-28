import {flags, SfdxCommand} from '@salesforce/command';
import {Messages, SfdxError, SfdxProject} from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { template, templateSettings } from 'dot';
import {existsSync, mkdirSync, writeFile} from 'fs';
import { DescribeSObjectResult } from 'jsforce/describe-result';
import { triggerTemplates } from '../../../templates/';
import { sObject } from '../../../utils';

templateSettings.strip = false;

const logError = (err: Error) => err ? console.log(err) : null;

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('gin-sfdx-plugin', 'trigger');

export default class Trigger extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');
  public static examples = [
    '$ sfdx gin:source:trigger'
  ];
  public static args = [{name: 'sObjectName'}];

  protected static flagsConfig = {
    triggerdir: flags.string({char: 't', default: 'force-app/main/default/triggers', description: messages.getMessage('triggerDirFlagDescription')}),
    metadatadir: flags.string({char: 'm', default: 'force-app/main/default/customMetadata', description: messages.getMessage('metadataDirFlagDescription')}),
    objectdir: flags.string({char: 'o', default: 'force-app/main/default/objects', description: messages.getMessage('objectDirFlagDescription')}),
    triggerhnddir: flags.string({char: 'h', default: 'force-app/main/default/classes/adapter/trigger-handler', description: messages.getMessage('triggerHandlerDirFlagDescription')})
  };
  protected static requiresUsername = true;
  protected static supportsDevhubUsername = true;
  protected static requiresProject = true;

  public async run(): Promise<AnyJson> {

    const project = await SfdxProject.resolve();
    const basePath = project.getPath();

    if (!project) {
      throw new SfdxError(messages.getMessage('errorNoSfdxProject'));
    }

    this.ux.log('Generating migration trigger code to ' + this.args.sObjectName);

    const conn = this.org.getConnection();
    const result: DescribeSObjectResult = await conn.describe(this.args.sObjectName);

    const sobj: sObject = new sObject(result);

    // generate triggers
    const triggerTemplate = template(triggerTemplates.triggerTemplate);
    const metadataTemplate = template(triggerTemplates.triggerMetadataSource);
    const triggerSourceCode = triggerTemplate({sobj});
    const metadataSourceCode = metadataTemplate({sobj});
    writeFile(`${basePath}/${this.flags.triggerdir}/${sobj.getTriggerName()}`, triggerSourceCode, logError);
    writeFile(`${basePath}/${this.flags.triggerdir}/${sobj.getTriggerMetadataFileName()}`, metadataSourceCode, logError);

    // generate metadata triggers
    const triggerMigrationHandlerMetadataTemplate = template(triggerTemplates.triggerMigrationHandlerMetadataTemplate);
    const triggerMigrationHandlerMetadataSourceCode = triggerMigrationHandlerMetadataTemplate({sobj});
    writeFile(`${basePath}/${this.flags.metadatadir}/di_Binding.${sobj.getMigrationTriggerHandlerImplementationName()}.md-meta.xml`, triggerMigrationHandlerMetadataSourceCode, logError);

    // generate migration field
    const migrationIdFieldTemplate = template(triggerTemplates.migrationIdFieldTemplate);
    const migrationIdFieldSourceCode = migrationIdFieldTemplate({sobj});

    if (!existsSync(`${basePath}/${this.flags.objectdir}/${sobj.getApiName()}`)) {
      mkdirSync(`${basePath}/${this.flags.objectdir}/${sobj.getApiName()}`);
    }

    if (!existsSync(`${basePath}/${this.flags.objectdir}/${sobj.getApiName()}/fields`)) {
      mkdirSync(`${basePath}/${this.flags.objectdir}/${sobj.getApiName()}/fields`);
    }

    writeFile(`${basePath}/${this.flags.objectdir}/${sobj.getApiName()}/fields/MigrationId__c.field-meta.xml`, migrationIdFieldSourceCode, logError);

    // generate migrationHandler
    const triggerHandlerTemplate = template(triggerTemplates.triggerHandlerTemplate);
    const triggerHandlerSourceCode = triggerHandlerTemplate({sobj});
    writeFile(`${basePath}/${this.flags.triggerhnddir}/${sobj.getMigrationTriggerHandlerImplementationClassName()}`, triggerHandlerSourceCode, logError);
    writeFile(`${basePath}/${this.flags.triggerhnddir}/${sobj.getMigrationTriggerHandlerMetadataName()}`, metadataSourceCode, logError);
    return {};

  }

}
