import { SfdxCommand } from "@salesforce/command";

export default class WaitReady extends SfdxCommand {
  public static description =
    "Waits until all Permission Set Groups are updated";

  public static examples = [
    `$ sfdx gin:sharing:waitReady" 
    all permission set groups were successfully updated
    `,
  ];

  protected static flagsConfig = {};
  protected static requiresUsername = true;
  protected static requiresDevhubUsername = false;
  protected static requiresProject = false;

  public async run(): Promise<any> {

    this.ux.startSpinner("waiting for permission set groups to resolve");
    await this.waitAllPermissions();
    this.ux.stopSpinner("\nall permission set groups were successfully updated");

  }

  private async waitAllPermissions() {
    const conn = this.org.getConnection();

    const repeatTimeout = 2000;
    const psGroupQuery = `SELECT Id,MasterLabel,Status, ManageableState, Description FROM PermissionSetGroup WHERE Status != 'Updated'`;

    const isCompleted = () => new Promise((resolve, reject) => {

      setInterval(async () => {
        const unfinishedPsGroups = await conn.tooling.query(psGroupQuery);

        if (unfinishedPsGroups.totalSize > 0) {
          this.ux.startSpinner(`Persmission Set Group left to resolve: ${unfinishedPsGroups.totalSize}`);
        }
        resolve(unfinishedPsGroups.totalSize === 0);
      }, repeatTimeout)
    });

    while(!(await isCompleted())) {}
  }
}
