/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement,track,api } from 'lwc';
import findRecords from '@salesforce/apex/LookupSObjectController.lookup';
import findRecord from '@salesforce/apex/LookupSObjectController.fetchlookupRecord';
export default class CustomLookuplwc extends LightningElement {
    @track records=[];
    @track error;
    @track selectedRecord;
    @api index;
    @api relationshipfield;
    @api label;
    @api iconname;
    @api title;
    @api objectName;
    @api searchfield;
    @api lookuprecordid;


    connectedCallback() {
        if(this.objectName ==='' ){
            this.objectName = 'Account';
        }

        if(this.title ===''){
            this.title ='Account';
        }

        if(this.searchfield ==='' ){
            this.searchfield = 'Name';
        }

        if(this.iconname ==='' ){
            this.iconname = 'standard:account';
        }

        if(this.lookuprecordid !== ''){
            findRecord({
                objId : this.lookuprecordid,
                searchfield : 'Name' 
            })
            .then(result => {
                    this.selectedRecord = result.Name;
                })
                .catch(error => {
                    this.error = error;
                    this.records = undefined;
                });
        }
    }

    /*constructor(){
        super();
        this.iconname = "standard:account";
        this.objectName = 'Account';
        this.searchField = 'Name';
    }*/

    handleChange(event){
        //this.records =null;
        const searchKey = event.detail.value;
        //event.preventDefault();
        
        //setTimeout(() => {
            this.handleChangeValue(searchKey);
       // }, 1000);
    }

    handleChangeValue(searchString){
        
        const searchKey = searchString;
        if(searchKey ==='' || searchKey.length <2){
            this.records =[];
            return;
        }
        
        /* Call the Salesforce Apex class method to find the Records */
        findRecords({
            searchString : searchKey, 
            sObjectAPIName: this.objectName, 
            maxRecordLimit:10, 
            fieldList:null,
            filterField:'',
            filterRecords:'',
            primaryFieldAPI:''
        })
        .then(result => {
            if(result.length ===0){
                this.records =[];
            }else if(result.length !== this.records.length){
                this.records = result;
                /*for(let i=0; i < this.records.length; i++){
                    const rec = this.records[i];
                    this.records[i].Name = rec[this.searchfield];
                }*/
                this.error = undefined;
                //console.log(' records ', this.records);
            }
            })
            .catch(error => {
                this.error = error;
                this.records = undefined;
            });    
    }

    handleSelect(event){
        //console.log(this.records);
        //console.log(this.records.length);
        this.selectedRecord = event.target.label;
        const selectedRecordEvent = new CustomEvent(
            "selectedrec",
            {
                //detail : selectedRecordId
                detail : { recordId : event.target.value, index : "this.index", relationshipfield : "this.relationshipfield"}
            }
        );
        this.dispatchEvent(selectedRecordEvent);
    }

    handleRemove(event){
        event.preventDefault();
        this.selectedRecord = undefined;
        this.records = undefined;
        this.error = undefined;
        const selectedRecordEvent = new CustomEvent(
            "selectedrec",
            {
                detail : { recordId : undefined, index : this.index, relationshipfield : this.relationshipfield}
            }
        );
        this.dispatchEvent(selectedRecordEvent);
    }
}