import { LightningElement, wire, track } from 'lwc';
import getAllAccountWithContacts from '@salesforce/apex/AccountContactWrapper.getAllAccountWithContacts'

export default class AccountContactDisplay extends LightningElement {

    accountsWithContact;
    accountsWithContacts;

    //WE CAN TRANSFORM DATA WITH CONNECTED CALLBACK  AND WITH WIRE ALSO
    // connectedCallback(){
    //     getAllAccountWithContacts().then(data =>{
    //         this.accountsWithContact = data;
    //         console.log(`this.accountsWithContact ${JSON.stringify(this.accountsWithContact)}`);
    //         this.tranformData(this.accountsWithContact);
    //     }).catch(error=>{
    //         console.error(error);
    //     })
    // }

    //TRANSFORMING DATA WITH WIRE
    @wire(getAllAccountWithContacts)
    wiredAccountWithContacts({data,error}){
        if(data){
            this.accountsWithContact = data;
            console.log(`this.accountsWithContact ${JSON.stringify(this.accountsWithContact)}`);
            this.tranformData(this.accountsWithContact);
        }else if(error){
            console.error(error);
        }
    }

    tranformData(data){
        //console.log('data'+data);
        this.accountsWithContacts = data.map(item =>{
                console.log(`data CountContact : ${item.contactCount}`);
                //We can't directly change the fields of data we got from apex,
                //We need to transform item

                //assigning the copy of contactCount in conContact
                let conCount =   item.contactCount;
                
                //if contacts is 0, false, else same 
                conCount = conCount ===0 ? false : conCount;
                //console.log('conCount'+conCount)

                //console.log('conlist '+item.contactList);

                //This is to transform the email field, if email doesn't exits, give false, else give email
                let contacts = item.contactList.map(i=>{
                    let email = i.Email;
                    console.log('email'+email);
                    email = email === undefined ? false : email;
                    console.log('email after tra'+email)
                    return {...i, "Email": email}
                })

                //console.log("contacts after transformation "+ contacts);
               
                return {...item, "contactCount": conCount, "contactList": contacts}

        });

        //console.log('this.accountsWithContacts'+JSON.stringify(this.accountsWithContacts));
    }



}