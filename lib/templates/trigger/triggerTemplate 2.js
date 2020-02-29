"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const triggerTemplate = `trigger {{=it.sobj.getName()}} on {{=it.sobj.getApiName()}} (before insert) {
  new TriggerDispatcher()
    .discoverAndDispatch(Schema.{{=it.sobj.getApiName()}}.SObjectType);
}`;
exports.default = triggerTemplate;
//# sourceMappingURL=triggerTemplate.js.map