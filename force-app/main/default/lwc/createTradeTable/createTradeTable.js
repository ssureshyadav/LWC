import { LightningElement,track,api,wire } from 'lwc';
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import TradeTable from '@salesforce/schema/Trade_Table__c';
import AMAT_Priority from '@salesforce/schema/Trade_Table__c.AMAT_Priority__c';
import Customer_Priority from '@salesforce/schema/Trade_Table__c.Customer_Priority__c';
export default class CreateTradeTable extends LightningElement {

    @api tradeTable;
    @api selectedvalue;
    @api type;
    @track isRd=false;
    @track isProd=false;

    @track localtradeTable = {
        Applied_Trade1__c : '',
        Applied_Trade_Value1__c :'',
        AMAT_Priority__c:'',
        Customer_Trade1__c:'',
        Customer_Trade_Value1__c:'',
        Customer_Priority__c:'',
        Id :'',
    }

    @wire (getObjectInfo, {objectApiName: TradeTable})
    objectInfo;

    @track amatPriority=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: AMAT_Priority })
    AMATPriorityPicklist({data}) {
        if (data) {
            this.amatPriority = this.addValuesToArray(this.tradeTable.AMAT_Priority__c,data.values);
        } 
        console.log(this.amatPriority);
    }

    @track customerPriority=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Customer_Priority })
    CustomerPriorityPicklist({data}) {
        if (data) {
            this.customerPriority = this.addValuesToArray(this.tradeTable.Customer_Priority__c,data.values);
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
        this.localtradeTable = {...this.tradeTable};
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }
    }

    handleAppliedTrade(event){
        this.localtradeTable.Applied_Trade1__c=event.target.value;
    }

    handleAppliedTradeValue(event){
        this.localtradeTable.Applied_Trade_Value1__c=event.target.value;
    }

    handleAMATPriority(event){
        this.localtradeTable.AMAT_Priority__c=event.target.value;
    }

    handleCustomerTrade(event){
        this.localtradeTable.Customer_Trade1__c=event.target.value;
    }

    handleCustomerTradeValue(event){
        this.localtradeTable.Customer_Trade_Value1__c=event.target.value;
    }

    handleCustomerPriority(event){
        this.localtradeTable.Customer_Priority__c=event.target.value;
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
        console.log(this.localtradeTable);
        const localValue=this.localtradeTable;
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