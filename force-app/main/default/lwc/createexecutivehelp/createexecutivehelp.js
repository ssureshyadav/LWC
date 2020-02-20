import { LightningElement,track,api,wire } from 'lwc';
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import ExecutiveHelp from '@salesforce/schema/Executive_Help_Needed__c';
import Status from '@salesforce/schema/Executive_Help_Needed__c.Status__c';

export default class Createexecutivehelp extends LightningElement {

    @api executivehelp;
    @api selectedvalue;
    @api type;
    @track isRd=false;
    @track isProd=false;

    @track localexecutivehelp = {
        Help_Needed__c:'',
        BU_Owner__c :'',
        Due_Date__c : '',
        Status__c :'',
        Id :'',
    }

    @wire (getObjectInfo, {objectApiName: ExecutiveHelp})
    objectInfo;

    @track status=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Status })
    StatusPicklist({data}) {
        if (data) {
            console.log(data.values);
            this.status = this.addValuesToArray(this.executivehelp.Status__c,data.values);
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
        this.localexecutivehelp = {...this.executivehelp};
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }
    }

    handleHelpNeeded(event){
        this.localexecutivehelp.Help_Needed__c=event.target.value;
    }

    handleUserRecord(event){
        console.log(event.detail.recordId);
        console.log(event.detail.index);
        this.localexecutivehelp.BU_Owner__c=event.detail.recordId;
    }

    handleDueDate(event){
        this.localexecutivehelp.Due_Date__c=event.target.value;
    }

    handlestatus(event){
        this.localexecutivehelp.Status__c=event.target.value;
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
        console.log(this.localexecutivehelp);
        const localValue=this.localexecutivehelp;
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