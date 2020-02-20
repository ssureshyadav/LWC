/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { LightningElement,track,api } from 'lwc';
import SOOLightningElement from 'c/sOOLightningElement';
import { NavigationMixin } from "lightning/navigation";

export default class Sooeconomicvalue extends NavigationMixin(SOOLightningElement) {

    @track bubm=false;
    @api recordId;
    @track field1;
    @track field2;
    @track field3; 
    @track field4;
    @track field5;
    @track field6;
    @track field7;
    @track field8;

    connectedCallback(){
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }
    }

    handleLoad(event){
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                //.fieldName + '--'+field.target.value
                if((field.fieldName ==='Account_Sales_EVA_Prod__c' || field.fieldName ==='Account_Sales_EVA_R_D__c') && field.value){
                    this.bubm =true;
                }
            });
        }
    }

    copyRandD(){
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                //.fieldName + '--'+field.target.value
                console.log(field.fieldName);
                console.log(field.value);
                //if(this.isEmpty(field.value)){
                    if(field.fieldName ==='EVA_Total_Economic_Value_Price__c' ){
                        this.field1 = field.value;  
                    }
                    if(field.fieldName ==='EVA_Reference_Price__c'){
                        this.field2 = field.value;  
                    }
                    if(field.fieldName ==='Initial_Anchor__c'){
                        this.field3 = field.value;  
                    }
                    if(field.fieldName ==='Customer_Anchor__c'){
                        this.field4 = field.value;  //.replace("$ ","")
                    }
                    if(field.fieldName ==='VPS_Value_Price_Range__c'){
                        this.field5 = field.value;  
                    }
                //}
                /*if(field.fieldName ==='Applied_Target_Reference_Price__c'){
                    this.field6 = field.value;  
                }
                if(field.fieldName ==='Competitor_Price_for_R_D__c'){
                    this.field7 = field.value;  
                }*/
                if(field.fieldName ==='New_Tool_Penetration_Opportunity__c'){
                    this.field8 = field.value;  
                }
            });
        }
    }

    handleSubmit(event){
        event.preventDefault(); // stop form submission
        console.log('onsubmit: '+ event.detail.fields);
        const fields = event.detail.fields;
        console.log(fields.EVA_Total_Economic_Value_Price__c);
        if(this.isEmpty(fields.EVA_Total_Economic_Value_Price__c) && !fields.EVA_Total_Economic_Value_Price__c.includes('$')){
            fields.EVA_Total_Economic_Value_Price__c ='$ '+fields.EVA_Total_Economic_Value_Price__c;
        }
        if(this.isEmpty(fields.EVA_Reference_Price__c) && !fields.EVA_Reference_Price__c.includes('$')){
            fields.EVA_Reference_Price__c='$ '+fields.EVA_Reference_Price__c;
        }

        if(this.isEmpty(fields.Initial_Anchor__c) &&!fields.Initial_Anchor__c.includes('$')){
            fields.Initial_Anchor__c='$ '+fields.Initial_Anchor__c;
        }
        if(this.isEmpty(fields.Customer_Anchor__c) &&!fields.Customer_Anchor__c.includes('$')){
            fields.Customer_Anchor__c='$ '+fields.Customer_Anchor__c;
        }

        if(this.isEmpty(fields.VPS_Value_Price_Range__c) &&!fields.VPS_Value_Price_Range__c.includes('$')){
            fields.VPS_Value_Price_Range__c='$ '+fields.VPS_Value_Price_Range__c;
        }
        console.log(JSON.stringify(fields));
        this.template.querySelector('lightning-record-edit-form').submit(fields);   
    }

    isEmpty(fieldvalue){
        console.log(fieldvalue);
        console.log(fieldvalue !== null && fieldvalue !== '');
        return (fieldvalue !== null && fieldvalue !== '');
    }

    handleBUBM(event){
        console.log(event.detail);
        console.log(event.detail.checked);
        this.bubm =event.detail.checked;
    }
    
    handleSuccess(event){
        if(this.isProd){
            this[NavigationMixin.Navigate]({
                type: "standard__recordPage",
                attributes: {
                  recordId: this.recordId,
                  objectApiName: "SOO__c",
                  actionName: "view"
                }
              });
        }else{
            const nextTab = new CustomEvent("save", {
                detail : {tabName : '5' , isparent : true}
            });
            this.dispatchEvent(nextTab);
        }
    }
}