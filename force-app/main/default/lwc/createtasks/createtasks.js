/* eslint-disable vars-on-top */

import { LightningElement,track,api } from 'lwc';
/* eslint-disable no-console */
/* eslint-disable array-callback-return */

export default class Createtasks extends LightningElement {

    @api task;
    @track user='User';
    @api isrd;
    @api selectedvalue;
    @api strategy;
    @track strategies=[];
    @track taskStatus=[];
    
    @track status =["Not Started","Completed","Waiting on someone else","In Progress / On Track",
                    "Delayed / At Risk","Delayed / At High Risk"];

    //@track strategy =["Strategy to Overcome Specifics"];

    @track localtask = {
        Subject : '',
        Non_SFDC_User_Action_Owner__c :'',
        Status:'',
        ActivityDate:'',
        OwnerId : '',
        Strategy__c :'',
        Id :'',
    }

    connectedCallback(){
        this.localtask = {...this.task};
        console.log('Strategy Value:'+this.localtask.Strategy__c);
        console.log(this.strategy.length);
        this.strategies=this.addStratagies(this.localtask.Strategy__c,this.strategy);
        this.taskStatus=this.addStratagies(this.localtask.Status,this.status);
    }

    handleSubject(event){
        this.localtask.Subject=event.target.value;
    }

    handleOwner(event){
        this.localtask.Non_SFDC_User_Action_Owner__c=event.target.value;
    }

    handleActivityDate(event){
        this.localtask.ActivityDate=event.target.value;
    }

    addStratagies(fieldValue,picklist){
        const arrayValue=[];
        if(fieldValue !== ''){
            arrayValue.push(fieldValue);    
        }
        arrayValue.push('None');
        picklist.some(function(item) {
            if(item !== fieldValue){
                arrayValue.push(item);
            }
        }, this);
        console.log(this.arrayValue);
        this.arrayValue=arrayValue.filter(Boolean);
        //arrayValue = arrayValue.filter(Boolean);
        return this.arrayValue;
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

    handleStatusChange(event){
        console.log(event.target.value);
        this.localtask.Status =event.target.value;
    }

    handlestrategyChange(event){
        console.log(event.target.value);
       this.localtask.Strategy__c =event.target.value;
    }

    handleUserRecord(event){
        console.log(event.detail.recordId);
        console.log(event.detail.index);
        this.localtask.OwnerId =event.detail.recordId;
    }

    proddeleteSelected(){
        //detail: { objectName : "task", selectedValue : this.selectedvalue}
        const deleteEvent = new CustomEvent("proddeleteselected", {
            detail: this.selectedvalue
        });
    
        // Dispatches the event.
        this.dispatchEvent(deleteEvent);
    }

    deleteSelected(){
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
        console.log(this.localtask);
        const localValue=this.localtask;
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