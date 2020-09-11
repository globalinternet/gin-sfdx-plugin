import { flags, SfdxCommand } from "@salesforce/command";
import { fs, Connection } from "@salesforce/core";

export default class AssignPermissionSetGroup extends SfdxCommand {
    public static description =
        `Acitvates Users based on User Names specified in the file
The file format:
{
    "userName": "Tom Sanders",
    "groupName": "AwesomeAdmin"
}
        `;

    public static examples = [
        `$ sfdx gin:user:activateusers -f ./file/path.json -u target_org" 
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
        await this.activateUsers();
    }

    private async activateUsers() {
        const data = await fs.readFile(this.flags.permissionfile)
            .then(data => {
                this.ux.log(data.toString('utf-8'));
                return JSON.parse(data.toString('utf-8'))
            });
        this.ux.logJson(data);
        const conn:Connection = this.org.getConnection();

        const users:{records:any[]} = await conn.query(`SELECT Id, Email, IsActive FROM User WHERE Name IN ('${data.psa.map(_ => _.userName).join('\',\'')}')`);
        this.ux.logJson(users.records);
        users.records.forEach(user => {
            user.IsActive = true;
            user.Email = user.Email.replace(/\.invalid/);
        })

        const result = await conn.update('User', users.records);
        this.ux.logJson(result);

    }
}
