/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { LightningElement,track,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import saveData from '@salesforce/apex/SOOLWCEdit.saveChildRecords';
import objectsList from '@salesforce/apex/SOOLWCEdit.loadredflagstrategy';
import SOOLightningElement from 'c/sOOLightningElement';

export default class Sooredflagstrategy extends SOOLightningElement {
    @track bubm=false;
    handleBUBM(event){
        console.log(event.detail);
        console.log(event.detail.checked);
        this.bubm =event.detail.checked;
    }

    connectedCallback(){

        this.obj = {
            Category__c : '',
            Specifics__c :'',
            Strategy_to_Overcome_Specifics__c:'',
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

    handleLoad(event){
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                //.fieldName + '--'+field.target.value
                if((field.fieldName ==='BU_BM_R_D_Red_Flag__c' || field.fieldName ==='BU_BM_Prod_Red_Flag__c') && field.value){
                    this.bubm =true;
                }
            });
        }
    }

    copyRandD(event){
        if(event.target.checked){
            for(var i=0; i < this.objcmpcount.length; i++) {
                var record = this.objcmpcount[i].value;
                this.prodobjcmpcount =[...this.prodobjcmpcount,{
                    label:  this.objcmpcount[i].label,   //maybe use index?
                    value: {
                        Category__c:record.Category__c,
                        Specifics__c:record.Specifics__c,
                        Strategy_to_Overcome_Specifics__c:record.Strategy_to_Overcome_Specifics__c,
                        Id:'',
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
        
        this.template.querySelectorAll("c-createredflagstrategy").forEach(element => {
            element.passValues();
        });
        
        const type=(this.type ==='RD'?'R&D':'Production');
        console.log(type);
        const objName ='Red_Flag_and_Strategy__c';
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
                    detail : {tabName : '6' , isparent : false}
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