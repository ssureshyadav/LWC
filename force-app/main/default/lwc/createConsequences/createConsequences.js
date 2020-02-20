import { LightningElement,track,api } from 'lwc';
/* eslint-disable no-console */
/* eslint-disable array-callback-return */

export default class CreateConsequences extends LightningElement {

    @api consequences;
    @api selectedvalue;
    @api type;
    @track isRd=false;
    @track isProd=false;

    @track localconsequences = {
        Applied_CNA1__c : '',
        Applied_CNA_Value1__c :'',
        Customer_CNA1__c:'',
        Customer_CNA_Value1__c:'',
        Id :'',
    }

    connectedCallback(){
        this.localconsequences = {...this.consequences};
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }
    }

    handleAppliedCNA(event){
        this.localconsequences.Applied_CNA1__c=event.target.value;
    }

    handleAppliedCNAValue(event){
        this.localconsequences.Applied_CNA_Value1__c=event.target.value;
    }

    handleCustomerCNA(event){
        this.localconsequences.Customer_CNA1__c=event.target.value;
    }

    handleCustomerCNAValue(event){
        this.localconsequences.Customer_CNA_Value1__c=event.target.value;
    }

    proddeleteSelected(){
        console.log('proddeleteSelected');
        const deleteEvent = new CustomEvent("deleteselected", {
            detail: this.selectedvalue
        });
    
        // Dispatches the event.
        this.dispatchEvent(deleteEvent);
    }

    deleteSelected(){
        console.log('deleteSelected');
        console.log('this.selectedvalue'+this.selectedvalue);
        const deleteEvent = new CustomEvent("deleteselected", {
            detail : this.selectedvalue
        });
        // Dispatches the event.
        this.dispatchEvent(deleteEvent);
    }

    @api passValues() {
        this.handlerValueChange();
    }

    handlerValueChange(){
        console.log('::handlerValueChange Start::');
        console.log(this.localconsequences);
        const localValue=this.localconsequences;
        console.log('localValue'+localValue);
        /*const demoValue = Object.values(localValue);
        console.log(demoValue);*/
        
        const valuechange = new CustomEvent("valuechanged", {
            detail: this.selectedvalue + '--'+JSON.stringify(localValue),
        });
        this.dispatchEvent(valuechange);
        // Dispatches the event.
        
        console.log('::handlerValueChange End::');
    }
}