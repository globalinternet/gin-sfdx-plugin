import { flags, SfdxCommand } from '@salesforce/command';
import { AnyJson } from '@salesforce/ts-types';
export default class Create extends SfdxCommand {
    static description: string;
    static examples: string[];
    protected static flagsConfig: {
        autousername: flags.Discriminated<flags.Boolean<boolean>>;
        profilename: flags.Discriminated<flags.Option<string>>;
        permissionsetnames: flags.Discriminated<flags.Option<string>>;
        usernamedomain: flags.Discriminated<flags.Option<string>>;
    };
    protected static requiresUsername: boolean;
    protected static supportsDevhubUsername: boolean;
    protected static requiresProject: boolean;
    run(): Promise<AnyJson>;
}
