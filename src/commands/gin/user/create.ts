import {flags, SfdxCommand} from '@salesforce/command';
import {Messages, SfdxError, SfdxProject} from '@salesforce/core';
import {AnyJson} from '@salesforce/ts-types';
import {exec} from 'child_process';

Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages('gin-sfdx-plugin', 'user');

export default class Create extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');
  public static examples = [
    '$ sfdx gin:user:create --profilename Sales --permissionsetnames "Marketing, Sales" --roleName="SVP Manager"'
  ];

  protected static flagsConfig = {
    generateuniqusername: flags.boolean({char: 'a', default: true, description: 'Generate a unique user name'}),
    profilename: flags.string({char: 'p', required: true, description: 'Profile name'}),
    permissionsetnames: flags.string({char: 'e', required: true, description: 'PermissionSet/PermissionSetGroup names'}),
    usernamedomain: flags.string({char: 'd', default: 'globalinter.net', description: 'UserName domain. E.g globalinter.net'}),
    rolename: flags.string({char: 'r', description: 'Role name'})
  };

  protected static requiresUsername = true;
  protected static supportsDevhubUsername = true;
  protected static requiresProject = true;

  public async run(): Promise<AnyJson> {

    const project = await SfdxProject.resolve();
    const commandUserName = this.org.getUsername();

    this.ux.log(`Create user on scratch org ${commandUserName}`);

    if (!project) {
      throw new SfdxError(messages.getMessage('errorNoSfdxProject'));
    }

    const conn = this.org.getConnection();

    interface UserRole {
      Id: string;
      Name: string;
    }
    let userRoleId = null;
    if (this.flags.rolename != null) {
      const result = await conn.query<UserRole>(`SELECT Id, Name FROM UserRole WHERE Name = '${this.flags.rolename}'`);
      if (result.records.length <= 0) {
        throw new Error(`RoleName not found ${this.flags.rolename}`);
      }
      userRoleId = result.records[0].Id;
    }

    this.ux.log('Creating users');

    const randomUserPrefix = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
    const userName = `${randomUserPrefix}@${this.flags.usernamedomain}`;
    const createUserCommand = `sfdx force:user:create UserRoleId="${userRoleId}" profileName="${this.flags.profilename}" username="${userName}" email="test@globalinter.net" permsets="${this.flags.permissionsetnames}" -u ${commandUserName}`;

    exec(createUserCommand, (error, stdout, stderr) => {
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
