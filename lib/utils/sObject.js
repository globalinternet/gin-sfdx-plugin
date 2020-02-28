"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:class-name
class sObject {
    constructor(sobjectDescribeResult) {
        this.sobjectDescribeResult = sobjectDescribeResult;
    }
    getFields() {
        return this.sobjectDescribeResult.fields;
    }
    getApiName() {
        return this.sobjectDescribeResult.name;
    }
    getName() {
        return this.sobjectDescribeResult.name.replace(/__c/g, '').replace(/__/g, '');
    }
    getTriggerName() {
        return this.getName() + '.trigger';
    }
    getTriggerMetadataFileName() {
        return this.getTriggerName() + '-meta.xml';
    }
    getMigrationTriggerHandlerImplementationName() {
        return `${this.getName()}MigHandler`;
    }
    getMigrationTriggerHandlerImplementationClassName() {
        return `${this.getName()}MigHandler.cls`;
    }
    getMigrationTriggerHandlerMetadataName() {
        return this.getMigrationTriggerHandlerImplementationClassName() + '-meta.xml';
    }
}
exports.default = sObject;
//# sourceMappingURL=sObject.js.map