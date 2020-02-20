/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { LightningElement,track,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import saveData from '@salesforce/apex/SOOLWCEdit.saveChildRecords';
import objectsList from '@salesforce/apex/SOOLWCEdit.loadtradeTable';
import SOOLightningElement from 'c/sOOLightningElement';

export default class SooTradeTable extends SOOLightningElement {

    connectedCallback(){

        this.obj = {
            Applied_Trade1__c : '',
            Applied_Trade_Value1__c :'',
            AMAT_Priority__c:'',
            Customer_Trade1__c:'',
            Customer_Trade_Value1__c:'',
            Customer_Priority__c:'',
            Id :'',
        }

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

        const parentRecord =this.recordId;//;
        console.log(parentRecord);
        
        this.template.querySelectorAll("c-create-trade-table").forEach(element => {
            element.passValues();
        });
        
        const type=(this.type ==='RD'?'R&D':'Production');
        console.log(type);
        const objName ='Trade_Table__c';
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
                const nextTab = new CustomEvent("save", {
                    detail : '6'
                });
                // Dispatches the event.
                this.dispatchEvent(nextTab);
                /*this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: result,
                        objectApiName: 'SOO__c',
                        actionName: 'view'
                    }
                });*/
            }
        })
        .catch(error => {
            this.error = error;
            this.objectFields = undefined;
        });
        console.log('::Save End::');
    }
}