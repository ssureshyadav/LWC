/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { LightningElement,track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import saveData from '@salesforce/apex/SOOLWCEdit.saveChildRecords';
import objectsList from '@salesforce/apex/SOOLWCEdit.loadhvps';
import SOOLightningElement from 'c/sOOLightningElement';

export default class Soohvps extends SOOLightningElement {
    @track bubm=false;
    connectedCallback(){
        this.obj = {
            Customer_HVP__c : '',
            Specifics__c :'',
            Id :'',
        }
        console.log(this.recordId);
        console.log(this.type);
        this.prodobj =this.obj;
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
                    //this.prodobjcmpcount.push({label :"1",value:this.obj});
                }
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.accounts = undefined;
            });
    }

    copyRandD(event){
        if(event.target.checked){
            for(var i=0; i < this.objcmpcount.length; i++) {
                var record = this.objcmpcount[i].value;
                this.prodobjcmpcount =[...this.prodobjcmpcount,{
                    label:  this.objcmpcount[i].label,   //maybe use index?
                    value: {
                        Customer_HVP__c:record.Customer_HVP__c,
                        Specifics__c:record.Specifics__c,
                        Id :''
                    }
                }];
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

    handleBUBM(event){
        console.log(event.detail);
        console.log(event.detail.checked);
        this.bubm =event.detail.checked;
    }

    @track recordPageUrl;
    save(){
        //console.log(this.dynamiccmpcount);
        console.log('::Save Start::');
        if(this.recordId === null)
        {
            return;
        }
        console.log('::Save Start::');
        const parentRecord =this.recordId;//;
        console.log(parentRecord);
        
        this.template.querySelectorAll("c-createhvps").forEach(element => {
            element.passValues();
        });
        
        const type=(this.type ==='RD'?'R&D':'Production');
        console.log(type);
        const objName ='HVPs__c';
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
                    detail : {tabName : '4' , isparent : false}
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