const triggerTemplate: string =
`trigger {{=it.sobj.getName()}} on {{=it.sobj.getApiName()}} (before insert) {
  new TriggerDispatcher()
    .discoverAndDispatch(Schema.{{=it.sobj.getApiName()}}.SObjectType);
}`;

export default triggerTemplate;
