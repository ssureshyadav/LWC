/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { LightningElement,track,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import saveData from '@salesforce/apex/SOOLWCEdit.saveChildRecords';
import objectsList from '@salesforce/apex/SOOLWCEdit.loadConsequences';
import SOOLightningElement from 'c/sOOLightningElement';

export default class SooConsequences extends SOOLightningElement {

    @track bubm=false;

    handleBUBM(event){
        console.log(event.detail);
        console.log(event.detail.checked);
        this.bubm =event.detail.checked;
    }

    connectedCallback(){
        console.log(this.recordId);
        console.log(this.type);
        this.obj = {
            Applied_CNA1__c : '',
            Applied_CNA_Value1__c :'',
            Customer_CNA1__c:'',
            Customer_CNA_Value1__c:'',
            Id :'',
        }
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
                    this.objcmpcount.push({label :"1",value:this.obj});
                }

                if(result.lstRecordsProduction.length>0){
                    for(var j=0; j < result.lstRecordsProduction.length; j++) {
                        this.mutatorprodMethod(result.lstRecordsProduction[j]);
                    }
                }else{
                    this.prodobjcmpcount.push({label :"1",value:this.obj});
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
                const rdRecord=this.objcmpcount[i].value;
                rdRecord.Id =null;
                this.prodobjcmpcount =[...this.prodobjcmpcount,{
                    label:  this.objcmpcount[i].label,   //maybe use index?
                    value: rdRecord
                }];
             }
             //
        }else{
            console.log('unchecked');
            console.log(this.prodobjcmpcount);
            console.log(this.objcmpcount);
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
        
        this.template.querySelectorAll("c-create-consequences").forEach(element => {
                element.passValues();
        });
        
        const type=(this.type ==='RD'?'R&D':'Production');
        console.log(type);
        const objName ='Consequences_of_No_Agreement__c';
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
                const deleteEvent = new CustomEvent("save", {
                    detail : '5'
                });
                // Dispatches the event.
                this.dispatchEvent(deleteEvent);
            }
        })
        .catch(error => {
            this.error = error;
            this.objectFields = undefined;
        });
        console.log('::Save End::');
    }
}