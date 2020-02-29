import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
export default class Trigger extends SfdxCommand {
    static description: string;
    static examples: string[];
    static args: {
        name: string;
    }[];
    protected static flagsConfig: {
        triggerdir: flags.Discriminated<flags.Option<string>>;
        metadatadir: flags.Discriminated<flags.Option<string>>;
        objectdir: flags.Discriminated<flags.Option<string>>;
        triggerhnddir: flags.Discriminated<flags.Option<string>>;
    };
    protected static requiresUsername: boolean;
    protected static supportsDevhubUsername: boolean;
    protected static requiresProject: boolean;
    run(): Promise<AnyJson>;
}
