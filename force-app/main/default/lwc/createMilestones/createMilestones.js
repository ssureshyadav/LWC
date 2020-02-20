import { LightningElement,track,api,wire } from 'lwc';
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import Milestone from '@salesforce/schema/Milestone__c';
import Stage from '@salesforce/schema/Milestone__c.Stage__c';
import Milestonepicklist from '@salesforce/schema/Milestone__c.Milestone__c';
import MilestoneStatus from '@salesforce/schema/Milestone__c.Milestone_Status__c';
import PrimaryReason from '@salesforce/schema/Milestone__c.Primary_Reason__c';
import Proof from '@salesforce/schema/Milestone__c.Proof__c';
//import objectsList from '@salesforce/apex/SOOLWCEdit.loadtambaIds';

export default class CreateMilestones extends LightningElement {

    @api milestone;
    @api selectedvalue;
    @api tambarecords;
    @api type;
    @track isRd=false;
    @track isProd=false;
    @track tambaArray;
    @track displayreason=false;

    @track localmilestone = {
        TAMBA_Name__c :'',
        Application_Name__c : '',
        Customer_Engagement1__c :'',
        Stage__c : '',
        Milestone__c :'',
        Target_Date__c:'',
        Milestone_Status__c:'',
        Prioritized_TAMBA_FYs__c :'',
        Additional_Information__c : '',
        Primary_Reason__c:'',
        Proof__c:'',
        Id :'',
    }

    connectedCallback(){
        this.localmilestone = {...this.milestone};
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }

        
        this.checkdisplayreason(this.localmilestone.Milestone_Status__c);
        console.log('Tamba Records:::'+this.tambarecords);
        this.tambaArray=this.addLookupValuesToArray(this.localmilestone.TAMBA_Name__c,this.tambarecords);
        /*objectsList({'tambaIds': this.localmilestone.TAMBA_Name__c !== ''?this.localmilestone.TAMBA_Name__c:this.tambarecords })
            .then(result => {
                this.tambaArray =result;
            })
            .catch(error => {
                this.error = error;
                this.accounts = undefined;
            });*/
    }

    addLookupValuesToArray(fieldValue,picklist){
        const arrayValue=[];
        arrayValue.push({key:'None',value:'None'});
        picklist.some(function(item) {
            if(item.Id !== fieldValue){
                //arrayValue.push(item.value);
                arrayValue.push({key:item.Id,value:item.Name});
            }else{
                arrayValue.unshift({key:fieldValue,value:item.Name});
            }
        }, this);
        this.arrayValue=arrayValue.filter(Boolean);
        return this.arrayValue;
    }

    @wire (getObjectInfo, {objectApiName: Milestone})
    objectInfo;

    @track stage=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Stage })
    stagePicklist({data}) {
        if (data) {
            this.stage = this.addValuesToArray(this.milestone.Stage__c,data.values);
        } 
    }

    @track primaryreason=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: PrimaryReason })
    primaryreasonPicklist({data}) {
        if (data) {
            this.primaryreason = this.addValuesToArray(this.milestone.Primary_Reason__c,data.values);
        } 
    }

    @track proof=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Proof })
    proofPicklist({data}) {
        if (data) {
            this.proof = this.addValuesToArray(this.milestone.Proof__c,data.values);
        } 
    }

    @track milepicklist=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Milestonepicklist })
    milepicklistPicklist({data}) {
        if (data) {
            this.milepicklist = this.addValuesToArray(this.milestone.Milestone__c,data.values);
        } 
    }

    @track milestoneStatus=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: MilestoneStatus })
    milestoneStatusPicklist({data}) {
        if (data) {
            this.milestoneStatus = this.addValuesToArray(this.milestone.Milestone_Status__c,data.values);
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

    handleTambaPicklist(event){
        console.log(event.target.value);
        this.localmilestone.TAMBA_Name__c=event.target.value;
    }

    handleStage(event){
        this.localmilestone.Stage__c=event.target.value;
    }

    handlemilestoneStatus(event){
        const statusvalue=event.target.value;
        this.localmilestone.Milestone_Status__c=statusvalue;
        this.checkdisplayreason(statusvalue);
    }

    handlePrimaryReason(event){
        this.localmilestone.Primary_Reason__c=event.target.value;
    }

    handleproof(event){
        this.localmilestone.Proof__c=event.target.value;
    }

    handleAddInfo(event){
        this.localmilestone.Additional_Information__c=event.target.value;
    }

    checkdisplayreason(statusvalue){
        if(statusvalue === 'Achieved' || statusvalue === 'Lost' || statusvalue === 'Gone' || statusvalue === 'Cancelled'){
            this.displayreason=true;
        }else{
            this.displayreason=false;
        }
    }

    handlemilepicklist(event){
        this.localmilestone.Milestone__c=event.target.value;
    }

    handleTargetdate(event){
        this.localmilestone.Target_Date__c=event.target.value;
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
        console.log(this.localmilestone);
        if(this.localmilestone.TAMBA_Name__c === '' || this.localmilestone.TAMBA_Name__c === null){
            this.localmilestone.TAMBA_Name__c =this.tambarecords[0];
        }
        const localValue=this.localmilestone;
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
