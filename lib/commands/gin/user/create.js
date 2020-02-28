"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@salesforce/command");
const core_1 = require("@salesforce/core");
const child_process_1 = require("child_process");
core_1.Messages.importMessagesDirectory(__dirname);
const messages = core_1.Messages.loadMessages('gin-sfdx-plugin', 'user');
class Create extends command_1.SfdxCommand {
    async run() {
        const project = await core_1.SfdxProject.resolve();
        const commandUserName = this.org.getUsername();
        this.ux.log(`Create user on scratch org ${commandUserName}`);
        if (!project) {
            throw new core_1.SfdxError(messages.getMessage('errorNoSfdxProject'));
        }
        this.ux.log('Creating users');
        const randomUserPrefix = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
        const userName = `${randomUserPrefix}@${this.flags.usernamedomain}`;
        const createUserCommand = `sfdx force:user:create profileName="${this.flags.profilename}" username="${userName}" email="test@globalinter.net" permsets="${this.flags.permissionsetnames}" -u ${commandUserName}`;
        child_process_1.exec(createUserCommand, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
        return {};
    }
}
exports.default = Create;
Create.description = messages.getMessage('commandDescription');
Create.examples = [
    '$ sfdx gin:user:create --profilename Sales --permissionsetnames "Marketing, Sales"'
];
Create.flagsConfig = {
    autousername: command_1.flags.boolean({ char: 'a', default: true, description: 'Generate a unique user name' }),
    profilename: command_1.flags.string({ char: 'p', required: true, description: 'Profile name' }),
    permissionsetnames: command_1.flags.string({ char: 'e', required: true, description: 'PermissionSet/PermissionSetGroup names' }),
    usernamedomain: command_1.flags.string({ char: 'd', default: 'globalinter.net', description: 'UserName domain. E.g globalinter.net' })
};
Create.requiresUsername = true;
Create.supportsDevhubUsername = true;
Create.requiresProject = true;
//# sourceMappingURL=create.js.map