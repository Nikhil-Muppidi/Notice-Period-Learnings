public inherited sharing class DescribeObjectHelper {
    //Retrieve all the objects from org
    @AuraEnabled (cacheable=true)
    public static List<String> retreieveObjects(){
        

        // List<String> objNames = new List<String>();

        // for( Schema.SObjectType o: Schema.getGlobalDescribe().values()){
        //     System.debug(o.getDescribe().getName());
        //     objNames.add(o.getDescribe().getName());
        // }
        // objNames.sort();
        // return objNames;

        Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe(); 
        List<String> apiNames = new List<String>();
        List<String> objNames = new List<String>();
        for(string objectApi: globalDescribe.keyset()){             
            apiNames.add(objectApi);
        }

        Schema.DescribeSobjectResult[] results  = Schema.describeSObjects(apiNames);
        for(Schema.DescribeSobjectResult describeResult  : results){                
            if(describeResult.isAccessible()) {
                System.debug(describeResult.getName()+'~~~~~~~~~~~~~~is accessible to this user');
                objNames.add(describeResult.getName());
            }
        }
        objNames.sort();
        System.debug('objNames '+objNames);
        return objNames;
        
    }

    //Retrieve field details based on Object API Name
    @AuraEnabled (cacheable=true)
    public static String getListOfFields(String objectAPIName){
        Map<string, string> fieldList = new Map<string, string>();
        if(!String.isEmpty(objectAPIName)){
            Map<String, String> mapField = new Map<String, String>();
            Map<string,SObjectField> lstFields = 
                schema.getGlobalDescribe().get(objectAPIName).getDescribe().fields.getMap();

            for(String str: lstFields.keySet()){
                System.debug('str'+str);
                mapField.put(str, lstFields.get(str).getDescribe().getLabel());                
            }
            System.debug(JSON.serializePretty(mapField));
            return JSON.serializePretty(mapField);
        }
        return null;
    }

    //Retrieve records based on selected fields and object.
    @AuraEnabled (cacheable=true)
    public static List<SObject> retreieveRecords(String objectName, String fieldAPINames, Integer lim){
        system.debug('limit value'+lim);
        String strQuery;
        if(String.isEmpty(fieldAPINames)){
            System.debug('inside string empty');
            strQuery = 'SELECT Id, Name FROM ' 
            + String.escapeSingleQuotes(objectName) 
            + ' LIMIT '+lim;

            System.debug('Empty String query'+strQuery);
        }else{
            System.debug('inside Field APi Names '+fieldAPINames);
             strQuery = 'SELECT ' + String.escapeSingleQuotes(fieldAPINames) 
                        + ' FROM ' 
                        + String.escapeSingleQuotes(objectName) 
                        + ' LIMIT '+lim;
            
        }

        return database.query(strQuery);
        
    }
}

