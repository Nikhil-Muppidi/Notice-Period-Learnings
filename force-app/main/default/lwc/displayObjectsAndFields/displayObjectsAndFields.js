/* eslint-disable no-empty */
/* eslint-disable no-undef */
/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-console */
import { LightningElement, track, wire } from 'lwc';
import retreieveObjects from '@salesforce/apex/DescribeObjectHelper.retreieveObjects';
import getListOfFields from '@salesforce/apex/DescribeObjectHelper.getListOfFields';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

// eslint-disable-next-line no-unused-vars

//define data table columns
const columns = [
    { label: 'Field Label', fieldName: 'FieldLabel' }, 
    { label: 'Field API Name', fieldName: 'FieldAPIName' },       
];

let i=0;
export default class DisplayObjectsAndFields extends LightningElement {

    userId = Id;

    
    
    
    recordsValue=10; // Default LIMIT value 

    get limitRecordOptions() {
        return [
            { label: 1, value: 1 },
            { label: 2, value: 2 },
            { label: 4, value: 3 },{ label: 4, value: 4 },{ label: 5, value: 5 },{ label: 6, value: 6 },
            { label: 7, value: 7 },{ label: 8, value: 8 },{ label: 9, value: 9 },{ label: 10, value: 10 },
            { label: 11, value: 11 },{ label: 12, value: 12 },{ label: 13, value: 13 },{ label: 14, value: 14 },
            { label: 15, value: 15 },{ label: 16, value: 16 },{ label: 17, value: 18 },{ label: 19, value: 19 },
            { label: 20, value: 20 },
        ];
    }
    @track value = '';  //this displays selected value of combo box
    @track items = []; //this holds the array for records with value & label
    @track fieldItems = []; //this holds the array for records with table data
    
    @track columns = columns;   //columns for List of fields datatable
    @track selectedFieldsValue=''; //fields selected in datatable
    @track tableData;   //data for list of fields datatable
    
    //retrieve object information to be displayed in combo box and prepare an array
    @wire(retreieveObjects)
    wiredObjects({ error, data }) {
        if (data) {
            //new efficient method with map, looking through each element
            data.map(element=>{
                this.items = [...this.items ,{value: element, 
                    label: element}];  
            });
            /*
            //previously used 'for' loop
            for(i=0; i<data.length; i++) {
                console.log('MasterLabel=' + data[i].MasterLabel + 'QualifiedApiName=' + data[i].QualifiedApiName);
                this.items = [...this.items ,{value: data[i].QualifiedApiName, 
                                              label: data[i].MasterLabel}];                                   
            } 
            */
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    //retrieve combo-box values as status options
    get statusOptions() {
        return this.items;
    }

    //retrieve field information based on selected object API name.
    @wire(getListOfFields,{objectAPIName: '$value'})
    wiredFields({ error, data }) {
        if (data) {            
            //first parse the data as entire map is stored as JSON string
            let objStr = JSON.parse(data);            
            //now loop through based on keys
            for(i of Object.keys(objStr)){
                console.log('FieldAPIName=' +i + 'FieldLabel=' + objStr[i]);
                //spread function is used to stored data and it is reversed order
                this.fieldItems = [
                    {FieldLabel: objStr[i], FieldAPIName: i},...this.fieldItems];  
            }
            this.tableData = this.fieldItems;
            this.error = undefined;            
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    //this method is fired based on combo-box item selection
    handleChange(event) {
        // get the string of the "value" attribute on the selected option
        const selectedOption = event.detail.value;
        this.value = selectedOption;
        this.fieldItems = []; //initialize fieldItems array 
        this.tableData = [];  //initialize list of fields datatable data

        //deplay the processing
        window.clearTimeout(this.delayTimeout);
        
        this.delayTimeout = setTimeout(() => {
            this.value = selectedOption;
        }, DELAY);
        
    }

    //this method is fired based on row selection of List of fields datatable
    handleRowAction(event){
        const selectedRows = event.detail.selectedRows;        
        this.selectedFieldsValue = '';  
 //newly efficient script
 // Display that fieldName of the selected rows in a comma delimited way
        selectedRows.map(element=>{
            if(this.selectedFieldsValue !=='' ){
                this.selectedFieldsValue = this.selectedFieldsValue + ',' + element.FieldAPIName;
            }
            else{
                this.selectedFieldsValue = element.FieldAPIName;
            }
        });
    }

    limitRecordHandler(event){
        this.recordsValue = event.target.value;
        console.log(`records value ${this.recordsValue}`)
    }

    //this method is fired when retrieve records button is clicked
    handleClick(event){        
        console.log('Inside retrieve click')
        const valueParam = this.value;
        const selectedFieldsValueParam = this.selectedFieldsValue;
       

         //propage event to next component
         console.log('Inside retrieve else')
         let val = this.recordsValue;
         const evtCustomEvent = new CustomEvent('retreive', {   
             detail: {valueParam, selectedFieldsValueParam, val}
             });
         this.dispatchEvent(evtCustomEvent);
    } 
    
    //this method is fired when reset button is clicked.
    handleResetClick(event){
        this.value = '';
        this.tableData = [];
        const evtCustomEvent = new CustomEvent('reset');
        this.dispatchEvent(evtCustomEvent);
    }
}