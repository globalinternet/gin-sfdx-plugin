const migrationTriggerHandlerTemplate: string =
`/**
 * A trigger handler implementation to setup migration field for {{=it.sobj.getApiName()}}
 * It is necessary to support CPQ Data Migration.
 */
public with sharing class {{=it.sobj.getMigrationTriggerHandlerImplementationName()}} extends TriggerHandler implements TriggerType.BeforeInsert {

  /**
   * Set MigrationId__c value with unique identifier
   * @param triggerContext
   * @return
   */
  public List<IHasEntityError> execute(TriggerContext triggerContext) {
    MigrationIdConfigurator.configure(triggerContext.records, {{=it.sobj.getApiName()}}.MigrationId__c);
    return null;
  }

}`;

export default migrationTriggerHandlerTemplate;
