import { Field } from 'jsforce';
import { DescribeSObjectResult } from 'jsforce/describe-result';

// tslint:disable-next-line:class-name
class sObject {

  private sobjectDescribeResult: DescribeSObjectResult;

  constructor(sobjectDescribeResult: DescribeSObjectResult) {
    this.sobjectDescribeResult = sobjectDescribeResult;
  }

  public getFields(): Field[] {
    return this.sobjectDescribeResult.fields;
  }

  public getApiName(): string {
    return this.sobjectDescribeResult.name;
  }

  public getName(): string {
    return this.sobjectDescribeResult.name.replace(/__c/g, '').replace(/__/g, '');
  }

  public getTriggerName(): string {
    return this.getName() + '.trigger';
  }

  public getTriggerMetadataFileName(): string {
    return this.getTriggerName() + '-meta.xml';
  }

  public getMigrationTriggerHandlerImplementationName(): string {
    return `${this.getName()}MigHandler`;
  }

  public getMigrationTriggerHandlerImplementationClassName(): string {
    return `${this.getName()}MigHandler.cls`;
  }

  public getMigrationTriggerHandlerMetadataName(): string {
    return this.getMigrationTriggerHandlerImplementationClassName() + '-meta.xml';
  }

}

export default sObject;
