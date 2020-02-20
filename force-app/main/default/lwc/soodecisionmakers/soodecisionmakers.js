/* eslint-disable no-new-object */
/* eslint-disable radix */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { LightningElement,track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import saveData from '@salesforce/apex/SOOLWCEdit.saveChildRecords';
import objectsList from '@salesforce/apex/SOOLWCEdit.loaddecisionmakers';
import SOOLightningElement from 'c/sOOLightningElement';

export default class Soodecisionmakers extends SOOLightningElement {

    @track accountsales=false;
    @track bubm=false;
    @track rdscore=0;
    @track prodscore=0;
    
    connectedCallback(){
        this.obj = {
            Decision_Maker__c : '',
            Buyer_Type__c : '',
            Buyer_TypeNa__c :'',
            Response_Mode__c:'',
            Position_to_SSO__c:'',
            Influence_Level__c : '',
            Competitive_Alliance__c : '',
            Commerical_Position__c : '',
            Title__c:'',
            Purchase_Status__c:0,
            Id:'',
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
                    let score=0;
                    for(var i=0; i < result.lstRecordsRd.length; i++) {
                        this.mutatorMethod(result.lstRecordsRd[i]);
                        score +=Number(result.lstRecordsRd[i].Purchase_Status__c);
                    }
                    this.rdscore=score.toFixed(2);
                }else{
                    //this.objcmpcount.push({label :"1",value:this.obj});
                }
                console.log(result.lstRecordsProduction.length);
                if(result.lstRecordsProduction.length>0){
                    let pscore=0;
                    for(var j=0; j < result.lstRecordsProduction.length; j++) {
                        this.mutatorprodMethod(result.lstRecordsProduction[j]);
                        console.log(pscore);
                        if(result.lstRecordsProduction[j].Purchase_Status__c !=null){
                            pscore +=Number(result.lstRecordsProduction[j].Purchase_Status__c);
                        }
                    }
                    //console.log(prodscore.toFixed(2));
                    this.prodscore=Number(this.prodscore) + pscore;
                }else{
                    //this.prodobjcmpcount.push({label :"1",value:this.prodobj});
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
                if((field.fieldName ==='BU_DMA__c' || field.fieldName ==='BU_DMA_Production__c') && field.value){
                    this.bubm =true;
                }
            });
        }
    }

    copyRandD(event){
        if(event.target.checked){
            let rscore=0;
            for(var i=0; i < this.objcmpcount.length; i++) {
                var record = this.objcmpcount[i].value;
                console.log(record.Decision_Maker__c);
                this.prodobjcmpcount =[...this.prodobjcmpcount,{
                    label:  this.objcmpcount[i].label,   //maybe use index?
                    value: {
                        Decision_Maker__c : record.Decision_Maker__c,
                        Buyer_Type__c : record.Buyer_Type__c,
                        Buyer_TypeNa__c : record.Buyer_TypeNa__c,
                        Response_Mode__c : record.Response_Mode__c,
                        Position_to_SSO__c : record.Position_to_SSO__c,
                        Influence_Level__c : record.Influence_Level__c,
                        Competitive_Alliance__c : record.Competitive_Alliance__c,
                        Commerical_Position__c : record.Commerical_Position__c,
                        Title1__c : record.Title1__c,
                        Purchase_Status__c : record.Purchase_Status__c,
                        Id : '',
                    }
                }];
                console.log(record.Purchase_Status__c);
                if(record.Purchase_Status__c !== null && record.Purchase_Status__c !==''){
                    rscore += Number(record.Purchase_Status__c);
                }
             }
             console.log(rscore);
             if(!isNaN(rscore)){
                this.prodscore += +rscore.toFixed(2);
            }
        }else{
            const prodRecords=this.prodobjcmpcount;
            for(var j=0; j < prodRecords.length; j++) {
                for(var k=0; k < this.objcmpcount.length; k++) {
                    if(this.objcmpcount[k].label=== prodRecords[j].label){
                        this.prodscore -=this.prodobjcmpcount[j].value.Purchase_Status__c;
                        this.prodobjcmpcount.splice(j,1);     
                    }
                 }
             }
        }
    }

    handleSaveClick(){
        this.save();
    }

    handlerStatusChange(event){
        this.template.querySelectorAll("c-createdecisionmakers").forEach(element => {
                element.passValues();
        });
        let score=0;
        for(var i=0; i < this.objcmpcount.length; i++) {
            var recData = JSON.parse(this.objcmpcount[i].value);
            score +=Number(recData.Purchase_Status__c);
            //score +=recData.Purchase_Status__c;
         }
         console.log(score);
         this.rdscore=score.toFixed(2);
    }

    handlerProdStatusChange(event){
        this.template.querySelectorAll("c-createdecisionmakers").forEach(element => {
                element.passValues();
        });
        let score=0;
        for(var i=0; i < this.prodobjcmpcount.length; i++) {
            var recData = JSON.parse(this.prodobjcmpcount[i].value);
            score +=Number(recData.Purchase_Status__c);
        }
        console.log(score);
        this.prodscore=score.toFixed(2);
    }

    handleAccSales(event){
        console.log(event.detail);
        console.log(event.detail.checked);
        this.accountsales =event.detail.checked;
    }

    handleBUBM(event){
        console.log(event.detail);
        console.log(event.detail.checked);
        this.bubm =event.detail.checked;
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
        this.template.querySelectorAll("c-createdecisionmakers").forEach(element => {
                element.passValues();
        });
        
        const type=(this.type ==='RD'?'R&D':'Production');
        console.log(type);
        const objName ='Decision_Makers__c';
        const parentApiName ="Sales_Optimizer__c";
        console.log(JSON.stringify(this.objcmpcount));           

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
                    detail : {tabName : '3' , isparent : false}
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