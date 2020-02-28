"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const triggerMigrationHandlerMetadataTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>{{=it.sobj.getMigrationTriggerHandlerImplementationName()}}</label>
    <protected>false</protected>
    <values>
        <field>BindingObjectAlternate__c</field>
        <value xsi:nil="true"/>
    </values>
    <values>
        <field>BindingObject__c</field>
        <value xsi:type="xsd:string">{{=it.sobj.getApiName()}}</value>
    </values>
    <values>
        <field>BindingSequence__c</field>
        <value xsi:nil="true"/>
    </values>
    <values>
        <field>To__c</field>
        <value xsi:type="xsd:string">{{=it.sobj.getMigrationTriggerHandlerImplementationName()}}</value>
    </values>
    <values>
        <field>Type__c</field>
        <value xsi:type="xsd:string">Apex</value>
    </values>
</CustomMetadata>
`;
exports.default = triggerMigrationHandlerMetadataTemplate;
//# sourceMappingURL=triggerMigrationHandlerMetadata.js.map