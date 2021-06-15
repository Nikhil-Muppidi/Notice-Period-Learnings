import { LightningElement, wire} from 'lwc';
import getContactList from '@salesforce/apex/paginationDataController.getContacts'
export default class PaginationDemo extends LightningElement {
    totalContacts
    visibleContacts;
    @wire(getContactList)
    wiredContact({error,data}){
        if(data){
            this.totalContacts = data;
            console.log(this.totalContacts);
        }
        if(error){
            console.error(error);
        }
    }

    updateContactHandler(event){
        console.log(event.detail.records);
        this.visibleContacts = [...event.detail.records];
    }
}