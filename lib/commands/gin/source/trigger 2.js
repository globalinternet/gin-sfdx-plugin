"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@salesforce/command");
const core_1 = require("@salesforce/core");
const dot_1 = require("dot");
const fs_1 = require("fs");
const templates_1 = require("../../../templates/");
const utils_1 = require("../../../utils");
dot_1.templateSettings.strip = false;
const logError = (err) => err ? console.log(err) : null;
// Initialize Messages with the current plugin directory
core_1.Messages.importMessagesDirectory(__dirname);
// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core_1.Messages.loadMessages('gin-sfdx-plugin', 'trigger');
class Trigger extends command_1.SfdxCommand {
    async run() {
        const project = await core_1.SfdxProject.resolve();
        const basePath = project.getPath();
        if (!project) {
            throw new core_1.SfdxError(messages.getMessage('errorNoSfdxProject'));
        }
        this.ux.log('Generating migration trigger code to ' + this.args.sObjectName);
        const conn = this.org.getConnection();
        const result = await conn.describe(this.args.sObjectName);
        const sobj = new utils_1.sObject(result);
        // generate triggers
        const triggerTemplate = dot_1.template(templates_1.triggerTemplates.triggerTemplate);
        const metadataTemplate = dot_1.template(templates_1.triggerTemplates.triggerMetadataSource);
        const triggerSourceCode = triggerTemplate({ sobj });
        const metadataSourceCode = metadataTemplate({ sobj });
        fs_1.writeFile(`${basePath}/${this.flags.triggerdir}/${sobj.getTriggerName()}`, triggerSourceCode, logError);
        fs_1.writeFile(`${basePath}/${this.flags.triggerdir}/${sobj.getTriggerMetadataFileName()}`, metadataSourceCode, logError);
        // generate metadata triggers
        const triggerMigrationHandlerMetadataTemplate = dot_1.template(templates_1.triggerTemplates.triggerMigrationHandlerMetadataTemplate);
        const triggerMigrationHandlerMetadataSourceCode = triggerMigrationHandlerMetadataTemplate({ sobj });
        fs_1.writeFile(`${basePath}/${this.flags.metadatadir}/di_Binding.${sobj.getMigrationTriggerHandlerImplementationName()}.md-meta.xml`, triggerMigrationHandlerMetadataSourceCode, logError);
        // generate migration field
        const migrationIdFieldTemplate = dot_1.template(templates_1.triggerTemplates.migrationIdFieldTemplate);
        const migrationIdFieldSourceCode = migrationIdFieldTemplate({ sobj });
        if (!fs_1.existsSync(`${basePath}/${this.flags.objectdir}/${sobj.getApiName()}`)) {
            fs_1.mkdirSync(`${basePath}/${this.flags.objectdir}/${sobj.getApiName()}`);
        }
        if (!fs_1.existsSync(`${basePath}/${this.flags.objectdir}/${sobj.getApiName()}/fields`)) {
            fs_1.mkdirSync(`${basePath}/${this.flags.objectdir}/${sobj.getApiName()}/fields`);
        }
        fs_1.writeFile(`${basePath}/${this.flags.objectdir}/${sobj.getApiName()}/fields/MigrationId__c.field-meta.xml`, migrationIdFieldSourceCode, logError);
        // generate migrationHandler
        const triggerHandlerTemplate = dot_1.template(templates_1.triggerTemplates.triggerHandlerTemplate);
        const triggerHandlerSourceCode = triggerHandlerTemplate({ sobj });
        fs_1.writeFile(`${basePath}/${this.flags.triggerhnddir}/${sobj.getMigrationTriggerHandlerImplementationClassName()}`, triggerHandlerSourceCode, logError);
        fs_1.writeFile(`${basePath}/${this.flags.triggerhnddir}/${sobj.getMigrationTriggerHandlerMetadataName()}`, metadataSourceCode, logError);
        return {};
    }
}
exports.default = Trigger;
Trigger.description = messages.getMessage('commandDescription');
Trigger.examples = [
    '$ sfdx gin:source:trigger'
];
Trigger.args = [{ name: 'sObjectName' }];
Trigger.flagsConfig = {
    triggerdir: command_1.flags.string({ char: 't', default: 'force-app/main/default/triggers', description: messages.getMessage('triggerDirFlagDescription') }),
    metadatadir: command_1.flags.string({ char: 'm', default: 'force-app/main/default/customMetadata', description: messages.getMessage('metadataDirFlagDescription') }),
    objectdir: command_1.flags.string({ char: 'o', default: 'force-app/main/default/objects', description: messages.getMessage('objectDirFlagDescription') }),
    triggerhnddir: command_1.flags.string({ char: 'h', default: 'force-app/main/default/classes/adapter/trigger-handler', description: messages.getMessage('triggerHandlerDirFlagDescription') })
};
Trigger.requiresUsername = true;
Trigger.supportsDevhubUsername = true;
Trigger.requiresProject = true;
//# sourceMappingURL=trigger.js.map