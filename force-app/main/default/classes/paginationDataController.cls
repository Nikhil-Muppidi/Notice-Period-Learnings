public with sharing class paginationDataController {
    
    @AuraEnabled(Cacheable=true)
    public static List<Contact> getContacts(){
        try {
            return [SELECT id, Name from Contact];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
