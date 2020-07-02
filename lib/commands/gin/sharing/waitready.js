"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@salesforce/command");
const kit_1 = require("@salesforce/kit");
const core_1 = require("@salesforce/core");
class WaitReady extends command_1.SfdxCommand {
    async run() {
        this.ux.startSpinner("waiting for permission set groups to resolve");
        await this.waitAllPermissions();
        this.ux.stopSpinner("\nall permission set groups were successfully updated");
    }
    async waitAllPermissions() {
        const conn = this.org.getConnection();
        let totalTime = 0;
        const repeatInterval = 2000;
        const timeout = this.flags.timeout.quantity * 60 * 1000;
        const psGroupQuery = `SELECT Id,MasterLabel,Status FROM PermissionSetGroup WHERE Status != 'Updated'`;
        const isCompleted = () => new Promise((resolve, reject) => setTimeout(async () => {
            totalTime += repeatInterval;
            const unfinishedPsGroups = await conn.tooling.query(psGroupQuery);
            if (unfinishedPsGroups.totalSize > 0 && totalTime > timeout) {
                reject(this.getTimeoutErrorMessage(unfinishedPsGroups.records));
            }
            this.ux.startSpinner(`Persmission Set Group left to resolve: ${unfinishedPsGroups.totalSize}`);
            resolve(unfinishedPsGroups.totalSize === 0);
        }, repeatInterval));
        try {
            while (!(await isCompleted())) { }
        }
        catch (e) {
            throw new core_1.SfdxError(e);
        }
    }
    getTimeoutErrorMessage(records) {
        const stringifyRecords = (records) => records
            .map((_) => Object.assign({
            Id: _.Id,
            MasterLabel: _.MasterLabel,
            Status: _.Status,
        }))
            .map(JSON.stringify)
            .join("\n");
        return `
Permission Set Group Update took too long: 
Here is unfinished PersmissionSetGroups:
${stringifyRecords(records)}
        `;
    }
}
exports.default = WaitReady;
WaitReady.description = "Waits until all Permission Set Groups are updated";
WaitReady.examples = [
    `$ sfdx gin:sharing:waitReady" 
    all permission set groups were successfully updated
    `,
];
WaitReady.flagsConfig = {
    timeout: command_1.flags.minutes({
        char: "t",
        description: "During in minutes before command fails",
        required: false,
        default: kit_1.Duration.minutes(1),
    }),
};
WaitReady.requiresUsername = true;
WaitReady.requiresDevhubUsername = false;
WaitReady.requiresProject = false;
//# sourceMappingURL=waitready.js.map