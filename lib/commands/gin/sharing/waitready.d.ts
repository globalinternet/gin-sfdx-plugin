import { flags, SfdxCommand } from "@salesforce/command";
export default class WaitReady extends SfdxCommand {
    static description: string;
    static examples: string[];
    protected static flagsConfig: {
        timeout: flags.Discriminated<flags.Milliseconds>;
    };
    protected static requiresUsername: boolean;
    protected static requiresDevhubUsername: boolean;
    protected static requiresProject: boolean;
    run(): Promise<any>;
    private waitAllPermissions;
    getTimeoutErrorMessage(records: any): string;
}
