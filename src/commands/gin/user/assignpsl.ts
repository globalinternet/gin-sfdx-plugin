import { flags, SfdxCommand } from "@salesforce/command";
import { SfdxError, fs } from "@salesforce/core";
import { SandboxOrgConfig } from "@salesforce/core/lib/config/sandboxOrgConfig";

export default class AssignPermissionSetLicense extends SfdxCommand {
    public static description =
        `Inserts CPQ Permission Set License to Users`;

    public static examples = [
        `$ sfdx gin:user:assignpsl -u target_org" 
    `,
    ];

    protected static flagsConfig = {
        userfilter: flags.string({
            char: 'f',
            description: 'filter string for users',
            required: false,
            default: ''
        })
    };
    protected static requiresUsername = true;
    protected static requiresDevhubUsername = false;
    protected static requiresProject = false;

    public async run(): Promise<any> {
        await this.insertPermissionSetGroups();
    }

    private async insertPermissionSetGroups() {
        const permissionName = 'SalesforceCPQ_CPQStandardPerm';
        const conn = this.org.getConnection();

        const users = await conn.query(`SELECT Id, Name FROM User ${this.flags.userfilter ? 'WHERE ' + this.flags.userfilter: ''}`);
        const permissionSetLicenses = await conn.query(`SELECT Id, DeveloperName FROM PermissionSetLicense WHERE DeveloperName = '${permissionName}'`);

        const permissionSetAssignments = users.records.map(_ => Object.assign({
                PermissionSetLicenseId: permissionSetLicenses.records[0].Id,
                AssigneeId: _.Id
            })
        );

        await conn.insert('PermissionSetLicenseAssignment', permissionSetAssignments);
    }
}
