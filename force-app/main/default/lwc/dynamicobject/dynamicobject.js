/* eslint-disable array-callback-return */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import { LightningElement,api,wire,track } from 'lwc';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import DecisionMakers from '@salesforce/schema/Decision_Makers__c'; 
import Buyer_Type from '@salesforce/schema/Decision_Makers__c.Buyer_Type__c';
//import Title from '@salesforce/schema/Decision_Makers__c.Title__c';
import Buyer_TypeNa from '@salesforce/schema/Decision_Makers__c.Buyer_TypeNa__c';
import Response_Mode from '@salesforce/schema/Decision_Makers__c.Response_Mode__c';
import Position_to_SSO from '@salesforce/schema/Decision_Makers__c.Position_to_SSO__c';
import Influence_Level from '@salesforce/schema/Decision_Makers__c.Influence_Level__c';
import Competitive_Alliance from '@salesforce/schema/Decision_Makers__c.Competitive_Alliance__c';
import Commerical_Position from '@salesforce/schema/Decision_Makers__c.Commerical_Position__c';

export default class Dynamicobject extends LightningElement {
    @api objname;
    @api object;
    @api selectedvalue;
    @api decisionmakers;
    @api parentid;
    @api isprod;
    @api isrd;

    /*@api 
    get decisionmakers() {
        return {...this.localdecisionmaker};
    }
    
     
    set decisionmakers(value) {
        console.log('decisionmakers:::'+value.Buyer_Type__c);
        this.localdecisionmaker = {...value};     
    }*/

    @track localdecisionmaker= {
        Buyer_Type__c : '',
        Buyer_TypeNa__c :'',
        Response_Mode__c:'',
        Position_to_SSO__c:'',
        Influence_Level__c : '',
        Competitive_Alliance__c : '',
        Commerical_Position__c : '',
        Title__c:''
    };

    @wire (getObjectInfo, {objectApiName: DecisionMakers})
    objectInfo;

    @track buyertype=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Buyer_Type })
    buyertypePicklist({data}) {
        if (data) {
            this.buyertype = this.addValuesToArray(this.decisionmakers.Buyer_Type__c,data.values);
        } 
    }

    @track Buyer_TypeNa=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Buyer_TypeNa })
    Buyer_TypeNaPicklist({data}) {
        if (data) {
            this.Buyer_TypeNa = this.addValuesToArray(this.decisionmakers.Buyer_TypeNa__c,data.values);
        } 
    }

    @track Response_Mode=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Response_Mode })
    Response_ModePicklist({data}) {
        if (data) {
            this.Response_Mode = this.addValuesToArray(this.decisionmakers.Response_Mode__c,data.values);
        } 
    }

    @track Position_to_SSO=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Position_to_SSO })
    Position_to_SSOPicklist({data}) {
        if (data) {
            this.Position_to_SSO = this.addValuesToArray(this.decisionmakers.Position_to_SSO__c,data.values);
        } 
    }

    @track Influence_Level=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Influence_Level })
    Influence_LevelPicklist({data}) {
        if (data) {
            this.Influence_Level = this.addValuesToArray(this.decisionmakers.Influence_Level__c,data.values);
        } 
    }
    
    @track Competitive_Alliance=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Competitive_Alliance })
    Competitive_AlliancePicklist({data}) {
        if (data) {
            this.Competitive_Alliance = this.addValuesToArray(this.decisionmakers.Competitive_Alliance__c,data.values);
        } 
    }

    @track Commerical_Position=[];
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Commerical_Position })
    Commerical_PositionePicklist({data}) {
        if (data) {
            this.Commerical_Position = this.addValuesToArray(this.decisionmakers.Commerical_Position__c,data.values);
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
        this.localdecisionmaker = {...this.decisionmakers};
        
        //console.log('buyertype'+JSON.stringify(this.buyertype));
    }

    proddeleteSelected(){
        const deleteEvent = new CustomEvent("proddeleteselected", {
            detail: this.selectedvalue,
        });
    
        // Dispatches the event.
        this.dispatchEvent(deleteEvent);
    }

    deleteSelected(){

        const deleteEvent = new CustomEvent("deleteselected", {
            detail: this.selectedvalue,
        });
    
        // Dispatches the event.
        this.dispatchEvent(deleteEvent);
    }

    handlebuyertypeChange(event){
        this.localdecisionmaker.Buyer_Type__c =event.target.value;
        //this.handlerValueChange();
    }

    handleInfluenceLevelChange(event){
        this.localdecisionmaker.Influence_Level__c =event.target.value;
    }

    handleAllianceChange(event){
        this.localdecisionmaker.Competitive_Alliance__c =event.target.value;
    }

    handlePositionChange(event){
        this.localdecisionmaker.Commerical_Position__c =event.target.value;
    }

    handleBuyerTypeNaChange(event){
        this.localdecisionmaker.Buyer_TypeNa__c =event.target.value;
        //this.handlerValueChange();
    }

    handleResponseModeChange(event){
        this.localdecisionmaker.Response_Mode__c =event.target.value;
        //this.handlerValueChange();
    }

    handlePositionTOSOOChange(event){
        this.localdecisionmaker.Position_to_SSO__c =event.target.value;
        //this.handlerValueChange();
    }

    @api passValues() {
        this.handlerValueChange();
    }

    handlerValueChange(){
        console.log('::handlerValueChange Start::');
        const localValue=this.localdecisionmaker;
        console.log('localValue'+localValue);
        const demoValue = Object.values(localValue);
        console.log(demoValue);
        console.log('isProd::'+this.isprod);
        
        const valuechange = new CustomEvent("valuechanged", {
            detail: this.selectedvalue + '--'+JSON.stringify(localValue),
        });
        this.dispatchEvent(valuechange);
        // Dispatches the event.
        
        console.log('::handlerValueChange End::');
    }
}