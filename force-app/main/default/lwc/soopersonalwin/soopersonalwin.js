/* eslint-disable guard-for-in */
/* eslint-disable no-eval */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { LightningElement,track,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import saveData from '@salesforce/apex/SOOLWCEdit.saveChildRecords';
import objectsList from '@salesforce/apex/SOOLWCEdit.loadpersonalwin';
import dmakerList from '@salesforce/apex/SOOLWCEdit.loadPWinDecisionMakers';
import SOOLightningElement from 'c/sOOLightningElement';

export default class Soopersonalwin extends SOOLightningElement {

    @track selecteddmakerrecords=[]; //=['a1L6C000000E6kGUAS','a1L6C000000E6kLUAS']

    /*constructor(){
        super();
        console.log('constructor');
    }*/



    /*render(){
        console.log('render');
    }*/

    /*disconnectedCallback(){
        console.log('disconnectedCallback');
    }*/

    connectedCallback(){

        this.obj = {
            Decision_Maker__c :'',
            Personal_WIN__c : '',
            Id :''
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
                    //this.objcmpcount.push({label :"1",value:this.personalwin});
                }

                if(result.lstRecordsProduction.length>0){
                    for(var j=0; j < result.lstRecordsProduction.length; j++) {
                        this.mutatorprodMethod(result.lstRecordsProduction[j]);
                    }
                }else{
                    //this.prodobjcmpcount.push({label :"1",value:this.personalwin});
                }
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
        });

        dmakerList({'recordid': this.recordId })
            .then(result => {
                //decision Makers Logic
                console.log(result);
                
                for(let key in result) {    
                    // Preventing unexcepted data
                    if (result.hasOwnProperty(key)) { // Filtering the data in the loop
                        this.selecteddmakerrecords.push({key: key, value: result[key]});
                    }
                    
                }
                //this.selecteddmakerrecords =result;
                console.log('this.selecteddmakerrecords::'+this.selecteddmakerrecords);
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
            });
            
    }

    createRDRecord(){
        if(this.selecteddmakerrecords.length ===0){
            alert('Please select atleast one milestone');
            return;
        }
        this.mutatorMethod('');
    }

    createProdRecord(){
        if(this.selecteddmakerrecords.length ===0){
            alert('Please select atleast one milestone');
            return;
        }
        this.mutatorprodMethod('');
    }

    @api
    addDmaker(dmakerRecords){
        this.selecteddmakerrecords =dmakerRecords;
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
        
        this.template.querySelectorAll("c-createpersonalwin").forEach(element => {
            element.passValues();
        });
        
        const type=(this.type ==='RD'?'R&D':'Production');
        console.log(type);
        const objName ='Personal_WIN__c';
        const parentApiName ="Sales_Optimizer__c";

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
                //eval("$A.get('e.force:refreshView').fire();");
                console.log('Next tab');
                const deleteEvent = new CustomEvent("save", {
                    detail : '8'
                });
                // Dispatches the event.
                this.dispatchEvent(deleteEvent);
                console.log("refresh");
                
            }
        })
        .catch(error => {
            this.error = error;
            this.objectFields = undefined;
        });
        console.log('::Save End::');
    }
}