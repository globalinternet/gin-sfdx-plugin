"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selectorInterface = `public interface {{=it.sobj.getInterfaceName()}} {
    gui_utl.fflib_QueryFactory addQueryFactorySubselect(gui_utl.fflib_QueryFactory parentQueryFactory, String relationshipName);
    gui_utl.fflib_QueryFactory newQueryFactory();
    void configureQueryFactoryFields(gui_utl.fflib_QueryFactory queryFactory, String relationshipFieldPath);
    Schema.{{=it.sobj.getApiName()}} findById(Id id);
    List<Schema.{{=it.sobj.getApiName()}}> findById(Set<Id> ids);
}`;
exports.default = selectorInterface;
//# sourceMappingURL=selectorInterface.js.map