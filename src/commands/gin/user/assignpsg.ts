import { flags, SfdxCommand } from "@salesforce/command";
import { SfdxError, fs } from "@salesforce/core";
import { SandboxOrgConfig } from "@salesforce/core/lib/config/sandboxOrgConfig";

export default class AssignPermissionSetGroup extends SfdxCommand {
    public static description =
        `Inserts Permission Set Groups to Users based on User Names specified in the file
The file format:
{
    "userName": "Tom Sanders",
    "groupName": "AwesomeAdmin"
}
        `;

    public static examples = [
        `$ sfdx gin:user:assignpsg -f ./file/path.json -u target_org" 
    `,
    ];

    protected static flagsConfig = {
        permissionfile: flags.filepath({
            char: 'f',
            description: 'file with permission set assignments',
            required: true,
            default: './data-migration/psa.json'
        })
    };
    protected static requiresUsername = true;
    protected static requiresDevhubUsername = false;
    protected static requiresProject = false;

    public async run(): Promise<any> {
        await this.insertPermissionSetLicense();
    }

    private async insertPermissionSetLicense() {
        const data = await fs.readFile(this.flags.permissionfile)
            .then(data => JSON.parse(data.toString('utf-8')));
        const psa = data.psa;

        const conn = this.org.getConnection();

        const users = await conn.query(`SELECT Id, Name FROM User WHERE Name IN ('${data.psa.map(_ => _.userName).join('\',\'')}')`);
        const permissionSetGroups = await conn.query(`SELECT Id, DeveloperName FROM PermissionSetGroup WHERE DeveloperName IN ('${data.psa.map(_ => _.groupName).join('\',\'')}')`);

        // if (psa.length != users.records.length || psa.length != permissionSetGroups.records.length) {
        //     throw new SfdxError('Parts of the data missing in the org. Please check User.Name and PermissionSetGroup.DeveloperName');
        // }

        const usersByName = users.records.reduce((acc, _) => Object.assign(acc, { [_.Name]: _ }, {}));
        const groupsByName = permissionSetGroups.records.reduce((acc, _) => Object.assign(acc, { [_.DeveloperName]: _ }), {});

        const permissionSetAssignments = psa.map(_ => Object.assign({
                PermissionSetGroupId: groupsByName[_.groupName].Id,
                AssigneeId: usersByName[_.userName].Id
            })
        );
        await conn.insert('PermissionSetAssignment', permissionSetAssignments);
    }
}
