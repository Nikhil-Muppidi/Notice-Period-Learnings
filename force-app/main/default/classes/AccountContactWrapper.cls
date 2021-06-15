public with sharing class AccountContactWrapper {

    @AuraEnabled(cacheable=true)
    public static List<AccountContactListWrapper> getAllAccountWithContacts() {
        List<AccountContactListWrapper> accConWrapperList = new List<AccountContactListWrapper>();
        List<Account> accList = [SELECT id, Name, (SELECT id, Name, FirstName, LastName, Email from Contacts)
                                From ACCOUNT LIMIT 5];
        if(!accList.isEmpty()){
            for(Account a: accList){
                // AccountContactListWrapper accConWrapper = new AccountContactListWrapper();
                // accConWrapper.accRecord = a;
                // accConWrapper.contactList = a.Contacts;
                // accConWrapper.contactCount = a.Contacts.size();
                accConWrapperList.add(new AccountContactListWrapper(a,a.Contacts,a.Contacts.size()));
                //accConWrapperList.add(accConWrapper);
        }

    }

    return accConWrapperList;
        
    }
    
    public class AccountContactListWrapper{
        
        @AuraEnabled public Account accRecord {get; set;}
        @AuraEnabled public List<Contact> contactList {get; set;}
        @AuraEnabled public Integer contactCount {get; set;}
        
        public AccountContactListWrapper(Account accRecord,List<Contact> contactList,Integer contactCount){
            this.accRecord=accRecord;
            this.contactList = contactList;
            this.contactCount = contactCount;
        }
        
       
    }
}