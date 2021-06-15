import { LightningElement,api } from 'lwc';

export default class Pagination extends LightningElement {
    currentPage=1;
    totalRecords
    recordsSize=5;
    visibleRecords
    totalPages
    get records(){
        return this.visibleRecords
    }
    @api
    set records(data){
        if(data){
            this.totalRecords=data;
            
            this.totalPages = Math.ceil(data.length/this.recordsSize);
            this.updateRecords();
        }
    }
    previousHandler(){
        if(this.currentPage>1){
            this.currentPage -=1;
            this.updateRecords();
        }
    }

    get disablePrevious(){
        return this.currentPage<=1
    }

    get disableNext(){
        return this.currentPage>=this.totalPages
    }

    nextHandler(){
        if(this.currentPage < this.totalPages){
            this.currentPage +=1;
            this.updateRecords();
        }
    }

    //This method will send data to parent component
    updateRecords(){
        const start = (this.currentPage-1)*this.recordsSize;
        const end = this.recordsSize*this.currentPage;
        this.visibleRecords = this.totalRecords.slice(start,end)
        this.dispatchEvent(new CustomEvent('update',{
            detail: {
                records: this.visibleRecords
            }
        }))
    }
}