/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { LightningElement,track,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import saveData from '@salesforce/apex/SOOLWCEdit.saveChildRecords';
import objectsList from '@salesforce/apex/SOOLWCEdit.loadTasks';
import redflagobjectsList from '@salesforce/apex/SOOLWCEdit.loadredflagstrategy';
import SOOLightningElement from 'c/sOOLightningElement';

export default class Sootasks extends SOOLightningElement {
    @track bubm=false;

    constructor() {
        super();
        console.log('Sootasks constructor::');
    }

    @track rdstrategy=[];
    @track prodstrategy=[];
    @track strategiesloaded=false;
    connectedCallback(){
        console.log(this.recordId);
        console.log(this.type);

        this.obj = {
            Subject : '',
            Non_SFDC_User_Action_Owner__c :'',
            Status:'Not Started',
            ActivityDate:'',
            OwnerId : '',
            Strategy__c :'',
            Id :'',
        }
        this.prodobj =this.obj;
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }

        console.log('connect Callback SooTasks');
        objectsList({'recordid': this.recordId })
            .then(result => {
                if(result.lstRecordsRd.length>0){
                    for(var i=0; i < result.lstRecordsRd.length; i++) {
                        this.mutatorMethod(result.lstRecordsRd[i]);
                    }
                }
                if(result.lstRecordsProduction.length>0){
                    for(var j=0; j < result.lstRecordsProduction.length; j++) {
                        this.mutatorprodMethod(result.lstRecordsProduction[j]);
                    }
                }

                redflagobjectsList({'recordid': this.recordId })
                    .then(rfresult => {
                        //decision Makers Logic
                        if(rfresult.lstRecordsRd.length>0){
                            for(var k=0; k < rfresult.lstRecordsRd.length; k++) {
                                const redflagrd=rfresult.lstRecordsRd[k];
                                this.rdstrategy.push(redflagrd.Strategy_to_Overcome_Specifics__c);
                            }
                        }

                        if(rfresult.lstRecordsProduction.length>0){
                            for(var l=0; l < rfresult.lstRecordsProduction.length; l++) {
                                const redflagprod=rfresult.lstRecordsProduction[l];
                                this.prodstrategy.push(redflagprod.Strategy_to_Overcome_Specifics__c);
                            }
                        }
                        console.log('rdstrategy'+this.rdstrategy);
                        console.log('prodstrategy'+this.prodstrategy);
                        this.strategiesloaded =true;
                    })
            })
    }

    handleBUBM(event){
        console.log(event.detail);
        console.log(event.detail.checked);
        this.bubm =event.detail.checked;
    }

    copyRandD(event){
        if(event.target.checked){
            console.log(this.objcmpcount.length);
            for(var i=0; i < this.objcmpcount.length; i++) {
                var record = this.objcmpcount[i].value;
                console.log(record);
                if(record.Subject != null && record.Subject !== ''){
                    this.prodobjcmpcount =[...this.prodobjcmpcount,{
                        label:  this.objcmpcount[i].label,   //maybe use index?
                        value: {
                            Subject:record.Subject,
                            Non_SFDC_User_Action_Owner__c:record.Non_SFDC_User_Action_Owner__c,
                            Status:'Not Started',
                            ActivityDate:record.ActivityDate,
                            OwnerId:record.OwnerId,
                            Strategy__c : record.Strategy__c,
                            Id:'',
                        }
                    }];
                }
             }
        }else{
            const prodRecords=this.prodobjcmpcount;
            for(var j=0; j < prodRecords.length; j++) {
                for(var k=0; k < this.objcmpcount.length; k++) {
                    if(this.objcmpcount[k].label=== prodRecords[j].label){
                        this.prodobjcmpcount.splice(j,1);     
                    }
                 }
             }
        }
    }

    handleSaveClick(){
        this.save();
    }
    

    handleLoad(event){
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                if((field.fieldName ==='BU_BM_Action_List_RD__c' || field.fieldName ==='BU_Action_List_Production__c') && field.value){
                    this.bubm =true;
                }
            });
        }
    }

    @track recordPageUrl;
    save(){
        //console.log(this.dynamiccmpcount);

        if(this.recordId === null)
        {
            return;
        }
        console.log('::Save Start::');
        const parentRecord =this.recordId;//;
        console.log(parentRecord);
        
        this.template.querySelectorAll("c-createtasks").forEach(element => {
                element.passValues();
        });
        
        const type=(this.type ==='RD'?'R&D':'Production');
        console.log(type);
        const objName ='Task';
        const parentApiName ="WhatId";

        saveData({ objdata :(this.type ==='RD'?JSON.stringify(this.objcmpcount):JSON.stringify(this.prodobjcmpcount)),parentRecord, type,objName,parentApiName}) //
            .then(result => {
                console.log(result);
                console.log(this.parentRecord);
                if(result.startsWith('Error')){
                    const evt = new ShowToastEvent({
                        title: 'Error',
                        message: result,
                        variant: 'error',
                    });
                    this.dispatchEvent(evt);
                }else{
                    console.log('Next tab');
                    const nextTab = new CustomEvent("save", {
                        detail : {tabName : '7' , isparent : false}
                    });
                    this.dispatchEvent(nextTab);
                }
            })
            .catch(error => {
                this.error = error;
                this.objectFields = undefined;
            });
        
        console.log('::Save End::');
    }
}