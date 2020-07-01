import { SfdxCommand } from '@salesforce/command';
export default class GenerateCustomMetadataFile extends SfdxCommand {
    static description: string;
    static examples: string[];
    protected static flagsConfig: {};
    protected static requiresUsername: boolean;
    protected static requiresDevhubUsername: boolean;
    protected static requiresProject: boolean;
    run(): Promise<any>;
    buildBourneSObjectFile(cmtFolderPath: any, sObjectName: any, data: any): {
        name: string;
        body: string;
    };
    buildBourneConfigFile(cmtFolderPath: any, data: any): {
        name: string;
        body: string;
    };
    private generateConfigFile;
}
