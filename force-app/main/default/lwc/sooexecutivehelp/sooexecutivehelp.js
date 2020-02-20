/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { LightningElement,track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import saveData from '@salesforce/apex/SOOLWCEdit.saveChildRecords';
import objectsList from '@salesforce/apex/SOOLWCEdit.loadexecutivehelp';
import SOOLightningElement from 'c/sOOLightningElement';

export default class Sooexecutivehelp extends SOOLightningElement {
    @track bubm=false;

    connectedCallback(){
        this.obj = {
            Help_Needed__c:'',
            BU_Owner__c :'',
            Due_Date__c : '',
            Status__c :'',
            Id :'',
        }
    
        this.prodobj = this.obj;
        
        console.log(this.recordId);
        console.log(this.type);
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }
        objectsList({'recordid': this.recordId })
            .then(result => {
                //decision Makers Logic
                if(result.lstRecordsRd.length>0){
                    for(var i=0; i < result.lstRecordsRd.length; i++) {
                        this.mutatorMethod(result.lstRecordsRd[i]);
                    }
                }else{
                    //this.objcmpcount.push({label :"1",value:this.obj});
                }

                if(result.lstRecordsProduction.length>0){
                    for(var j=0; j < result.lstRecordsProduction.length; j++) {
                        this.mutatorprodMethod(result.lstRecordsProduction[j]);
                    }
                }else{
                    //this.prodobjcmpcount.push({label :"1",value:this.prodobj});
                }  
            })
    }

    handleLoad(event){
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                //.fieldName + '--'+field.target.value
                if((field.fieldName ==='BU_BM_RD_Help_Needed__c' || field.fieldName ==='BU_BM_Prod_Help_Needed__c') && field.value){
                    this.bubm =true;
                }
            });
        }
    }

    copyRandD(event){
        console.log(event.target.checked);
        if(event.target.checked){
            console.log(this.objcmpcount);
            console.log('r&d Length::'+this.objcmpcount.length);
            for(var i=0; i < this.objcmpcount.length; i++) {
                var record = this.objcmpcount[i].value;
                this.prodobjcmpcount =[...this.prodobjcmpcount,{
                    label:  this.objcmpcount[i].label,   //maybe use index?
                    value: {
                        Help_Needed__c:record.Help_Needed__c,
                        BU_Owner__c:record.BU_Owner__c,
                        Due_Date__c:record.Due_Date__c,
                        Status__c:record.Status__c,
                        Id:'',
                    }
                }];
             }
             console.log(this.prodobjcmpcount);
             console.log('Prod Length::'+this.prodobjcmpcount.length);
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

    handleBUBM(event){
        console.log(event.detail);
        console.log(event.detail.checked);
        this.bubm =event.detail.checked;
    }

    handleSaveClick(){
        this.save();
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
        this.template.querySelectorAll("c-createexecutivehelp").forEach(element => {
                element.passValues();
        });
        
        const type=(this.type ==='RD'?'R&D':'Production');
        console.log(type);
        const objName ='Executive_Help_Needed__c';
        const parentApiName ="SOO__c";
            
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
                    detail : {tabName : '8' , isparent : false}
                });
                this.dispatchEvent(nextTab);
            }
        })
        .catch(error => {
            this.error = error;
        });
        console.log('::Save End::');
    }
}