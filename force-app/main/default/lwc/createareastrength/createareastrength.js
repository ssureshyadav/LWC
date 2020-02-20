import { LightningElement,track,api,wire } from 'lwc';
/* eslint-disable no-console */
/* eslint-disable array-callback-return */
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import AreaofStrength from '@salesforce/schema/Area_of_Strength__c';
import StrengthCategory from '@salesforce/schema/Area_of_Strength__c.Identify_Areas_of_Strength_Category__c';

export default class Createareastrength extends LightningElement {

    @api areastrength;
    @api selectedvalue;
    @api type;
    @track isRd=false;
    @track isProd=false;

    @track localareastrength = {
        Identify_Areas_of_Strength_Category__c : '',
        Specifics__c :'',
        Id :'',
    }

    @wire (getObjectInfo, {objectApiName: AreaofStrength})
    objectInfo;

    @track strengthcategory=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: StrengthCategory })
    strengthcategoryPicklist({data}) {
        if (data) {
            this.strengthcategory = this.addValuesToArray(this.areastrength.Identify_Areas_of_Strength_Category__c,data.values);
        } 
    }

    addValuesToArray(fieldValue,picklist){
        
        const arrayValue=[];
        if(fieldValue !== ''){
            arrayValue.push(fieldValue);    
        }
        arrayValue.push('None');
        picklist.some(function(item) {
            if(item.value !== fieldValue){
                arrayValue.push(item.value);
            }
        }, this);
        this.arrayValue=arrayValue.filter(Boolean);
        //arrayValue = arrayValue.filter(Boolean);
        return this.arrayValue;
    }

    connectedCallback(){
        this.localareastrength = {...this.areastrength};
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }
    }

    handlestrengthcategory(event){
        this.localareastrength.Identify_Areas_of_Strength_Category__c=event.target.value;
    }

    handleSpecifics(event){
        this.localareastrength.Specifics__c=event.target.value;
    }

    proddeleteSelected(){
        const deleteEvent = new CustomEvent("deleteselected", {
            detail: this.selectedvalue
        });
    
        // Dispatches the event.
        this.dispatchEvent(deleteEvent);
    }

    deleteSelected(){
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
        const localValue=this.localareastrength;
        /*const demoValue = Object.values(localValue);
        console.log(demoValue);*/
        
        const valuechange = new CustomEvent("valuechanged", {
            detail: this.selectedvalue + '--'+JSON.stringify(localValue),
        });
        this.dispatchEvent(valuechange);
        // Dispatches the event.
    }
}