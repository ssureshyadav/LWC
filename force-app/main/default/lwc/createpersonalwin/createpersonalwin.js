/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import { LightningElement,track,api } from 'lwc';
/* eslint-disable no-console */

export default class Createpersonalwin extends LightningElement {

    @api personalwin;
    @api selectedvalue;
    @api dmakerrecords;
    @api type;
    @track isRd=false;
    @track isProd=false;
    @track dMakerArray;

    @track localpersonalwin = {
        Decision_Maker__c :'',
        Personal_WIN__c : '',
        Id :''
    }

    connectedCallback(){
        //this.dMakerArray =this.dmakerrecords;
        //console.log(this.personalwin.Decision_Maker__c);
        
        if(this.personalwin.Decision_Maker__c != null){
            this.dMakerArray =this.addValuesToArray(this.personalwin.Decision_Maker__c,this.dmakerrecords);
            console.log(this.dMakerArray);
        }else{
            this.dMakerArray =this.dmakerrecords;
        }
        
        this.localpersonalwin = {...this.personalwin};
        if(this.type === 'RD'){
            this.isRd =true;
        }else if(this.type === 'Production'){
            this.isProd =true;
        }
        
        /*objectsList({'tambaIds': this.localpersonalwin.TAMBA_Name__c !== ''?this.localpersonalwin.TAMBA_Name__c:this.tambarecords })
            .then(result => {
                this.tambaArray =result;
            })
            .catch(error => {
                this.error = error;
            });*/
    }

    addValuesToArray(fieldValue,arrayRecords){
        const arrayValue=[];
        /*if(fieldValue !== ''){
            arrayValue.push({key :fieldValue,value : "test"});    
        }*/
        //arrayValue.push('None');
        let name='';
        arrayRecords.some(function(item) {
            console.log(item.key);
            if(item.key !== fieldValue){
                arrayValue.push({key :item.key,value : item.value});
            }else{
                name =item.value;
            }
        }, this);
        arrayValue.unshift({key :fieldValue,value : name});    
        this.arrayValue=arrayValue.filter(Boolean);
        //arrayValue = arrayValue.filter(Boolean);
        return this.arrayValue;
    }

    handleDMakerPicklist(event){
        console.log(event.target.value);
        this.localpersonalwin.Decision_Maker__c=event.target.value;
    }

    handlepersonWin(event){
        this.localpersonalwin.Personal_WIN__c=event.target.value;
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
        console.log(this.localpersonalwin);
        if(this.localpersonalwin.Decision_Maker__c === '' || this.localpersonalwin.Decision_Maker__c === null){
            //this.localpersonalwin.Decision_Maker1__c =dmakerrecords[0];
            for (let value of Object.values(this.dMakerArray)) {
                this.localpersonalwin.Decision_Maker__c =value.key;
            }
        }
        const localValue=this.localpersonalwin;
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
