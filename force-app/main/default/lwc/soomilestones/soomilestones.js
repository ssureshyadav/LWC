/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-eval */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { track,api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import saveData from '@salesforce/apex/SOOLWCEdit.saveChildRecords';
import objectsList from '@salesforce/apex/SOOLWCEdit.loadmilestone';
import loadTamba from '@salesforce/apex/SOOLWCEdit.loadtambaIds';
import SOOLightningElement from 'c/sOOLightningElement';

export default class Soomilestones extends SOOLightningElement {
    @track bubm=false;
    @api tambarecords;
    @track tambaArray;
    @track soodid;
    //@api selectedtambarecords; //=['a1L6C000000E6kGUAS','a1L6C000000E6kLUAS']

    /*@wire(objectsList,  { recordid : '' } )
    wiredContacts({ error, data }) {
        console.log('Wire Property');
        if (data !== undefined ) {
             this.apexResponse=data;
             const result=this.apexResponse;
            console.log(result);
            console.log(result.lstRecordsRd.length);
            if(result.lstRecordsRd.length>0){
                for(var i=0; i < result.lstRecordsRd.length; i++) {
                    this.mutatorMethod(result.lstRecordsRd[i]);   
                } 
            }
            console.log(result.lstRecordsProduction.length);
            if(result.lstRecordsProduction.length>0){
                for(var j=0; j < result.lstRecordsProduction.length; j++) {
                    this.mutatorprodMethod(result.lstRecordsProduction[j]);
                }
            }
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }*/

    connectedCallback(){
        this.obj = {
            Id :'',
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
        }
        this.prodobj =this.obj;

        console.log('Tamba records::'+this.tambarecords);

        objectsList({'recordid': this.recordId })
            .then(result => {
                //decision Makers Logic
                console.log('Server Call Start');
                let tambaIds=[];
                if(result.lstRecordsRd.length>0){
                    for(var i=0; i < result.lstRecordsRd.length; i++) {
                        this.mutatorMethod(result.lstRecordsRd[i]);
                        tambaIds.push(result.lstRecordsRd[i].TAMBA_Name__c);
                    }
                }else{
                    //this.objcmpcount.push({label :"1",value:this.obj});
                }

                if(result.lstRecordsProduction.length>0){
                    for(var j=0; j < result.lstRecordsProduction.length; j++) {
                        this.mutatorprodMethod(result.lstRecordsProduction[j]);
                        tambaIds.push(result.lstRecordsProduction[j].TAMBA_Name__c);
                    }
                }else{
                    //this.prodobjcmpcount.push({label :"1",value:this.prodobj});
                }
                console.log('Server Call End');
                console.log(tambaIds);
                //tambaIds.push.apply(tambaIds, this.tambarecords);
                this.handletambarecords(tambaIds);
                
            })
            .catch(error => {
                this.error = error;
        });

        /*console.log('selectedtambarecords::::'+this.selectedtambarecords.length);
        if(this.selectedtambarecords.length === 0){
            const nextTab = new CustomEvent("save", {
                detail : {tabName : '1' , isparent : true}
            });
            this.dispatchEvent(nextTab);
        }*/
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }
    }

    handletambarecords(tambaIds){
        
        this.tambarecords.forEach(function(value){
            console.log('tambarecord Value'+value);
            if (tambaIds.indexOf(value)===-1){ 
                tambaIds.push(value);
            }
        });
        //this.tambaArray =this.tambarecords;
        if(tambaIds.length >0){
            loadTamba({'tambaIds': tambaIds })
            .then(resultData => {
                this.tambaArray =resultData;
            })
        }
    }

    @api
    addTamba(tRecords){
        //console.log(this.selectedtambarecords);
        console.log('milestone:addTamba '+tRecords);
        //this.selectedtambarecords =tRecords;
        this.handletambarecords(tRecords);
        //this.milestone.TAMBA_Name__c =this.selectedtambarecords[0];
       /* for(var i=0;i<tambaRecords.length;i++){
            this.selectedtambarecords.push(tambaRecords[i]);
        }*/
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
                if(record.TAMBA_Name__c !== ''){
                this.prodobjcmpcount =[...this.prodobjcmpcount,{
                    label:  this.objcmpcount[i].label,   //maybe use index?
                    value: {
                        TAMBA_Name__c:record.TAMBA_Name__c,
                        Application_Name__c:record.Application_Name__c,
                        Customer_Engagement1__c:record.Customer_Engagement1__c,
                        Stage__c:record.Stage__c,
                        Milestone__c:record.Milestone__c,
                        Target_Date__c:record.Target_Date__c,
                        Milestone_Status__c:record.Milestone_Status__c,
                        Prioritized_TAMBA_FYs__c:record.Prioritized_TAMBA_FYs__c,
                        Additional_Information__c:record.Additional_Information__c,
                        Primary_Reason__c:record.Primary_Reason__c,
                        Proof__c:record.Proof__c,
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
        this.template.querySelectorAll("c-create-milestones").forEach(element => {
            element.passValues();
        });
        
        const type=(this.type ==='RD'?'R&D':'Production');
        console.log(type);
        const objName ='Milestone__c';
        const parentApiName ="SOO__c";
            
        saveData({ objdata :(this.type ==='RD'?JSON.stringify(this.objcmpcount):JSON.stringify(this.prodobjcmpcount)),parentRecord, type,objName,parentApiName}) //
            .then(result => {
                console.log(result);
                //console.log(this.parentRecord);
                if(result.startsWith('Error')){
                    const evt = new ShowToastEvent({
                        title: 'Error',
                        message: result,
                        variant: 'error',
                    });
                    this.dispatchEvent(evt);
                }else{
                    const nextTab = new CustomEvent("save", {
                        detail : {tabName : '2' , isparent : false}
                    });
                    this.dispatchEvent(nextTab);
                    // Dispatches the event.
                    console.log("refresh");    
                    //return refreshApex(this.objcmpcount,this.prodobjcmpcount); //this.findSomething
                }
            })
            .catch(error => {
                this.error = error;
                this.objectFields = undefined;
            });
        console.log('::Save End::');
    }
}