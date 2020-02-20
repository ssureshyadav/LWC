/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement,api,track } from 'lwc';
import loadPSCfromTAMBA from '@salesforce/apex/SOOLWCEdit.loadPSCfromTAMBA';
import saveData from '@salesforce/apex/SOOLWCEdit.savesOOInTAMBA';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class Sootagging extends LightningElement {
    @api recordId;
    @track ptamba='';
    @track pscRecords=[];
    @track hasPSC=false;
    @track soopsc='';
    @track loadTamba =false;
    @track isrecursive=false;
    @track tambaSelectedIds=[];

    handleSuccess(event) {
        this.sooId = event.detail.id;
        this.recordId = event.detail.id;
        console.log(this.sooId);
        console.log(this.recordId);
        const nextTab = new CustomEvent("save", {
            detail : {tabName : "3" , isparent : true}
        });
        this.dispatchEvent(nextTab);
      }

      handleLoad(){
          if(this.isrecursive){
              return;
          }
        //var recUi = event.getParam("recordUi");
        //console.log(recUi.record.id);
        console.log('handleLoad');
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                if(field.fieldName ==='TAMBA__c'){
                    if(field.value != null && field.value !== undefined){
                        this.ptamba =field.value;
                    }
                    this.loadTamba =true;
                }
                if(field.fieldName ==='Primary_Product_Scorecard__c'){
                    if(field.value != null && field.value !== undefined){
                        this.soopsc =field.value;
                    }
                    
                }
            });   
        }
        if(this.soopsc !== '' && this.ptamba !== ''){
            console.log('onload'+this.ptamba);
            this.handlePtambaPSC(this.ptamba);
        }
    }

    handleSubmit(event) {
        event.preventDefault(); // stop form submission
        console.log('onsubmit: '+ event.detail.fields);
        const fields = event.detail.fields;
        console.log(JSON.stringify(fields));
        
        fields.TAMBA__c = this.ptamba;
        fields.Primary_Product_Scorecard__c =this.soopsc;
        console.log(JSON.stringify(fields));
        
        if(this.tambaSelectedIds.length>0){
            console.log('::Slected Tamba::::'+JSON.stringify(this.tambaSelectedIds));
            saveData({ lstTambaIds :JSON.stringify(this.tambaSelectedIds),sooId : this.recordId}) //
            .then(result => {
                console.log(result);
                if(result.startsWith('Error')){
                    const evt = new ShowToastEvent({
                        title: 'Error',
                        message: result,
                        variant: 'error',
                    });
                    this.dispatchEvent(evt);
                }else{
                    this.template.querySelector('lightning-record-edit-form').submit(fields);
                }
            })
        }else{
            this.template.querySelector('lightning-record-edit-form').submit(fields);
        }
    }



    handleTambaPriority(event) {
        console.log(event.target.value);
        /*const accId = this.template.querySelector('[data-id="accountInfo"]').value;
        const businessvalue = this.template.querySelector('[data-id="businessUnit"]').value;
        const priority = event.target.value;
    
        if (accId === "" || accId === null) {
          alert("Account should not be null");
          return;
        }
    
        if (businessvalue === "" || businessvalue === null) {
          alert("BusinessUnit should not be null");
          return;
        }
        loadtamba({'accountId':this.accId,'businessUnit':this.businessvalue,'status':this.priority})
            .then(result => {
                this.lstTamba =result;
            })
            .catch(error => {
                this.error = error;
                this.accounts = undefined;
            });
        }*/
        if(event.target.value !== ""){
            this.template.querySelector("c-soo-tamba").fetchRecords(event.target.value);
        }
      }

      handleTambaselected(event) {
        //console.log(event.detail);
        console.log(event.detail);
        this.tambaSelectedIds =event.detail;
        //console.log(this.template.querySelector('c-soo-milestone'));
        const tambachange = new CustomEvent("tambaselected", {detail: event.detail});
        // Dispatches the event.
        this.dispatchEvent(tambachange);
        //this.template.querySelector("c-soomilestones").addTamba(event.detail);
      }

      @api
      saveRecords(){
          console.log('SOO Tagging Save');
            this.template.querySelector('.submitButton').click();
      }

      handlepscRecords(event){
          console.log(event.target.value);
          if(event.target.value !=='None'){
            this.soopsc =event.target.value;
          }
      }

      handlePtambaPSC(primary){
        this.isrecursive =true;
        this.ptamba =primary;
        if(this.ptamba !==''){
            console.log('recordId'+this.recordId);
            this.pscRecords =[];
            loadPSCfromTAMBA({'tambaName':this.ptamba})
            .then(result => {
                console.log(result.length);
                if(result.length > 0){
                    this.hasPSC =true;
                    this.pscRecords.push({id :'None',Name :'None'});
                    for(let i=0; i < result.length; i++) {
                        if(this.soopsc === result[i].Id){
                            this.pscRecords.unshift({id :result[i].Id,Name :result[i].Name});
                        }else{
                            this.pscRecords.push({id :result[i].Id,Name :result[i].Name});
                        }
                    }
                }else{
                    this.hasPSC =false;
                    this.pscRecords=[];
                }
                console.log(this.pscRecords);
                
            });
        }else{
            this.pscRecords =[];
            this.hasPSC =false;
        }
      }

      handlePTamba(event){
        console.log(event.detail);
        this.handlePtambaPSC(event.detail);
      }


}