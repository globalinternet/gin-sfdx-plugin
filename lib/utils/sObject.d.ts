import { Field } from 'jsforce';
import { DescribeSObjectResult } from 'jsforce/describe-result';
declare class sObject {
    private sobjectDescribeResult;
    constructor(sobjectDescribeResult: DescribeSObjectResult);
    getFields(): Field[];
    getApiName(): string;
    getName(): string;
    getTriggerName(): string;
    getTriggerMetadataFileName(): string;
    getMigrationTriggerHandlerImplementationName(): string;
    getMigrationTriggerHandlerImplementationClassName(): string;
    getMigrationTriggerHandlerMetadataName(): string;
}
export default sObject;
