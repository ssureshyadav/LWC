import { LightningElement,track,api,wire } from 'lwc';
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import HVP from '@salesforce/schema/HVPs__c';
import CustomerHVP from '@salesforce/schema/HVPs__c.Customer_HVP__c';

export default class Createhvps extends LightningElement {

    @api hvps;
    @api selectedvalue;
    @api type;
    @track isRd=false;
    @track isProd=false;

    @track localhvps = {
        Customer_HVP__c : '',
        Specifics__c :'',
        Id :'',
    }

    @wire (getObjectInfo, {objectApiName: HVP})
    objectInfo;

    @track customerhvp=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: CustomerHVP })
    CustomerHVPPicklist({data}) {
        if (data) {
            console.log(data.values);
            this.customerhvp = this.addValuesToArray(this.hvps.Customer_HVP__c,data.values);
        } 
    }

    addValuesToArray(fieldValue,picklist){
        const arrayValue=[];
        if(fieldValue !== ''){
            arrayValue.push(fieldValue);    
        }
        arrayValue.push('None');
        picklist.some(function(item) {
            if(item.value !== fieldValue){
                arrayValue.push(item.value);
            }
        }, this);
        this.arrayValue=arrayValue.filter(Boolean);
        //arrayValue = arrayValue.filter(Boolean);
        return this.arrayValue;
    }

    connectedCallback(){
        this.localhvps = {...this.hvps};
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }
    }

    handleCustomerhvp(event){
        this.localhvps.Customer_HVP__c=event.target.value;
    }

    handleSpecifics(event){
        this.localhvps.Specifics__c=event.target.value;
    }

    proddeleteSelected(){
        console.log('proddeleteSelected');
        const deleteEvent = new CustomEvent("deleteselected", {
            detail: this.selectedvalue
        });
    
        // Dispatches the event.
        this.dispatchEvent(deleteEvent);
    }

    deleteSelected(){
        console.log('deleteSelected');
        console.log('this.selectedvalue'+this.selectedvalue);
        const deleteEvent = new CustomEvent("deleteselected", {
            detail : this.selectedvalue
        });
        // Dispatches the event.
        this.dispatchEvent(deleteEvent);
    }

    @api passValues() {
        this.handlerValueChange();
    }

    handlerValueChange(){
        console.log('::handlerValueChange Start::');
        console.log(this.localhvps);
        const localValue=this.localhvps;
        console.log('localValue'+localValue);
        /*const demoValue = Object.values(localValue);
        console.log(demoValue);*/
        
        const valuechange = new CustomEvent("valuechanged", {
            detail: this.selectedvalue + '--'+JSON.stringify(localValue),
        });
        this.dispatchEvent(valuechange);
        // Dispatches the event.
        
        console.log('::handlerValueChange End::');
    }
}