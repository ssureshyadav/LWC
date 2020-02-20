import { LightningElement,track,api,wire } from 'lwc';
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import RedFlagStrategy from '@salesforce/schema/Red_Flag_and_Strategy__c';
import Category from '@salesforce/schema/Red_Flag_and_Strategy__c.Category__c';

export default class Createredflagstrategy extends LightningElement {

    @api strategy;
    @api selectedvalue;
    @api type;
    @track isRd=false;
    @track isProd=false;

    @track localstrategy = {
        Category__c : '',
        Specifics__c :'',
        Strategy_to_Overcome_Specifics__c:'',
        Id :'',
    }

    @wire (getObjectInfo, {objectApiName: RedFlagStrategy})
    objectInfo;

    @track category=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Category })
    CustomerHVPPicklist({data}) {
        if (data) {
            this.category = this.addValuesToArray(this.strategy.Category__c,data.values);
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
        this.localstrategy = {...this.strategy};
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }
    }

    handlecategory(event){
        this.localstrategy.Category__c=event.target.value;
    }

    handleSpecifics(event){
        this.localstrategy.Specifics__c=event.target.value;
    }

    handleOvercomeSpecifics(event){
        this.localstrategy.Strategy_to_Overcome_Specifics__c=event.target.value;
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
        console.log(this.localstrategy);
        const localValue=this.localstrategy;
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