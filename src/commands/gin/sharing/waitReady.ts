import { flags, SfdxCommand } from "@salesforce/command";
import { Duration } from "@salesforce/kit";
import { SfdxError } from "@salesforce/core";

export default class WaitReady extends SfdxCommand {
  public static description =
    "Waits until all Permission Set Groups are updated";

  public static examples = [
    `$ sfdx gin:sharing:waitReady" 
    all permission set groups were successfully updated
    `,
  ];

  protected static flagsConfig = {
    timeout: flags.minutes({
      char: "t",
      description: "During in minutes before command fails",
      required: false,
      default: Duration.minutes(1),
    }),
  };
  protected static requiresUsername = true;
  protected static requiresDevhubUsername = false;
  protected static requiresProject = false;

  public async run(): Promise<any> {
    this.ux.startSpinner("waiting for permission set groups to resolve");
    await this.waitAllPermissions();
    this.ux.stopSpinner(
      "\nall permission set groups were successfully updated"
    );
  }

  private async waitAllPermissions() {
    const conn = this.org.getConnection();

    let totalTime = 0;
    const repeatInterval = 2000;
    const timeout = this.flags.timeout.quantity * 60 * 1000;
    const psGroupQuery = `SELECT Id,MasterLabel,Status FROM PermissionSetGroup WHERE Status != 'Updated'`;

    const isCompleted = () =>
      new Promise((resolve, reject) => 
        setTimeout(async () => {

          totalTime += repeatInterval;
          const unfinishedPsGroups = await conn.tooling.query(psGroupQuery);

          if (unfinishedPsGroups.totalSize > 0) {
            if (totalTime > timeout) {
              reject(this.getTimeoutErrorMessage(unfinishedPsGroups.records));
            } else {
              this.ux.startSpinner(
                `Persmission Set Group left to resolve: ${unfinishedPsGroups.totalSize}`
              );
            }
          }
          resolve(unfinishedPsGroups.totalSize === 0);
        }, repeatInterval)
      );

    try {
      while (!(await isCompleted())) {}
    } catch (e) {
      throw new SfdxError(e);
    }
  }


  getTimeoutErrorMessage(records) {
    const stringifyRecords = (records) =>
      records
        .map((_: { Id; MasterLabel; Status }) =>
          Object.assign({
            Id: _.Id,
            MasterLabel: _.MasterLabel,
            Status: _.Status,
          })
        )
        .map(JSON.stringify)
        .join("\n");

    return `
Permission Set Group Update took too long: 
Here is unfinished PersmissionSetGroups:
${stringifyRecords(records)}
        `;
  }
}
