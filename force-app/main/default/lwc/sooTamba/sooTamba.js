/* eslint-disable vars-on-top */
/* eslint-disable no-alert */
/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-const-assign */
/* eslint-disable no-console */
import { LightningElement,api,track } from 'lwc';
//import loadTamba from '@salesforce/apex/SOOLWCEdit.loadtamba';
import loadTambaSOO from '@salesforce/apex/SOOLWCEdit.loadTambafromSOO';

let maptamba = new Map();

export default class SooTamba extends LightningElement {

    @api lstTamba=[];
    @track selectedTamba=[];
    @api recordId;
    @api ptambaId;
    @track tambasoo;
    @track samplelist=[];
    @track isPrimaryTambaSelected=false;

    connectedCallback(){
        console.log(this.recordId);
        console.log(this.ptambaId);
        loadTambaSOO({'recordId':this.recordId,'priority':''})
        .then(result => {
            this.handlepopulateData(result);
            //this.lstTamba =result;
        })
        .catch(error => {
            this.error = error;
        });
    }

    handlepopulateData(result){
        console.log(result.length);
        if(result.length>0){
            this.samplelist =[];
            for(var i=0; i < result.length; i++) {
                const rec=result[i];
                var devicetype='';
                var CustomerNode='';
                var ApplicationNameCustomer='';
                
                if(rec.Device_Type__c !== undefined && rec.Device_Type__c !== ''){
                    devicetype = rec.Device_Type__r.Name;
                }
                if(rec.Customer_Node__c !== undefined && rec.Customer_Node__c !== ''){
                    CustomerNode = rec.Customer_Node__r.Name;
                }
                if(rec.Application_Name_Customer__c !== undefined && rec.Application_Name_Customer__c !== ''){
                    ApplicationNameCustomer = rec.Application_Name_Customer__r.Name;
                }
                maptamba.set(rec.Name,rec.Id);
                /*this.lstTamba=[...this.lstTamba,
                    {
                        id : result[i].Id,
                        Name :result[i].Name,
                        BU__c :result[i].BU__c,
                        Primary_Tamba__c :result[i].Primary_Tamba__c,
                        Device_Type__c :devicetype,
                        Customer_Node__c :CustomerNode,
                        Application_Name_Customer__c :ApplicationNameCustomer,
                        Prioritized_TAMBA_FYs__c :result[i].Prioritized_TAMBA_FYs__c,
                        Criticality__c :result[i].Criticality__c,
                        Differentiation__c :result[i].Differentiation__c,
                        Account_Adoption_Probability__c :result[i].Account_Adoption_Probability__c,
                    }];*/
                /*if(rec.SOO__c === rec.recordId){
                    this.selectedTamba.push(rec.Id);
                }*/

                if(rec.Id === this.ptambaId){
                    this.isPrimaryTambaSelected =true;
                }
                
                this.samplelist.push({
                    isSoo :((rec.SOO__c === this.recordId)?true:false),
                    id : rec.Id,
                    Name :rec.Name,
                    BU__c :rec.BU__c,
                    isTamabaSelected:((rec.SOO__c === this.recordId)?false:true),
                    ischecked :(rec.Id === this.ptambaId),
                    Device_Type__c :devicetype,
                    Customer_Node__c :CustomerNode,
                    Application_Name_Customer__c :ApplicationNameCustomer,
                    Prioritized_TAMBA_FYs__c :rec.Prioritized_TAMBA_FYs__c,
                    Criticality__c :rec.Criticality__c,
                    Differentiation__c :rec.Differentiation__c,
                    Account_Adoption_Probability__c :rec.Account_Adoption_Probability__c,
                });
            }
            this.handletambarecords(this.samplelist);
        }else{
            this.samplelist =[];
        }
        
    }

    @api
    fetchRecords(priority){
        //console.log(this.priority);
        loadTambaSOO({'recordId':this.recordId,'priority':priority})
            .then(result => {
                //this.samplelist =result;
                this.handlepopulateData(result);
            })
            .catch(error => {
                this.error = error;
                this.accounts = undefined;
            });
    }

    /*@api
    fetchRecords(account,businessvalue,priority){
        //console.log(this.priority);

        loadTamba({'accountId':account,'businessUnit':businessvalue ,'status' : priority})
            .then(result => {
                this.lstTamba =result;
            })
            .catch(error => {
                this.error = error;
                this.accounts = undefined;
            });
    }*/

    

    /*handletambaPrimary(event){
        console.log(event.target.dataset.value);
        if(event.target.checked){
            /*const tambaPrimary = new CustomEvent("scorecardselected", {detail: { 'tambaId' : event.target.dataset.value , 'psc' : psc}});
            this.dispatchEvent(tambaPrimary);*
            //const tambalist=this.lstTamba;
            for(let j=0; j < this.lstTamba.length; j++) {
                console.log(this.lstTamba[j].id === event.target.dataset.value);
                if(this.lstTamba[j].id === event.target.dataset.value){
                    this.lstTamba[j].Primary_Tamba__c =true;
                }else{
                    this.lstTamba[j].Primary_Tamba__c =false;
                }
             }


        }else{
            /*const tambaPrimary = new CustomEvent("scorecardselected", {detail: { 'tambaId' : '' , 'psc' : ''}});
            this.dispatchEvent(tambaPrimary);*
        }
    }*/

    handletambarecords(tambalist){
        console.log('Tamba list'+tambalist);
        for(let j=0; j < tambalist.length; j++) {
            if(tambalist[j].isSoo){
                console.log('is Soo::'+tambalist[j].isSoo);
                if (this.selectedTamba.indexOf(tambalist[j].id) === -1){
                    this.selectedTamba.push(tambalist[j].id);
                } 
            }
         }
         console.log('handletambarecords'+this.selectedTamba);
         if(this.selectedTamba.length>0){
            const tambachange = new CustomEvent("tambaselected", {detail: this.selectedTamba});
            // Dispatches the event.
            this.dispatchEvent(tambachange);
         }
    }

    handletambaChange(event){
        
        const tambaName=event.target.dataset.value;
        const tambaId=maptamba.get(tambaName);
        console.log('tambaName'+tambaName);
        console.log('tambaId'+tambaId);
        if(event.target.checked){
            //this.selectedTamba.push({key:event.target.dataset.value,value:event.target.id});
            this.selectedTamba.push(tambaId);
            if(!this.isPrimaryTambaSelected){
                this.handlepimarytamba(tambaId);
                this.isPrimaryTambaSelected =true;
            }
        }else{
            //this.selectedTamba.pop(tambaId);
            var index = this.selectedTamba.indexOf(tambaId);
            if(this.ptambaId ===tambaId){
                this.ptambaId ='';
                this.handlepimarytamba('');
            }
            if (index !== -1) {
                this.selectedTamba.splice(index, 1);
            }
        }

        for(let j=0; j < this.samplelist.length; j++) {
            if(this.selectedTamba.includes(this.samplelist[j].id)){
                this.samplelist[j].isTamabaSelected =false;
            }else{
                this.samplelist[j].isTamabaSelected =true;
            }
        }
        
        const tambachange = new CustomEvent("tambaselected", {detail: this.selectedTamba});
        // Dispatches the event.
        this.dispatchEvent(tambachange);
    }

    handlechange(event){
        if(event.target.checked){
            const recId=maptamba.get(event.target.dataset.value);
            this.handlepimarytamba(recId)
        }else{
            this.isPrimaryTambaSelected =false;
            const tambaPrimary = new CustomEvent("ptambaselected", {detail: ''});
            this.dispatchEvent(tambaPrimary);
        }
        console.log(this.isPrimaryTambaSelected);
    }

    handlepimarytamba(tambaRecordId){
        console.log('handlepimarytamba::'+tambaRecordId);
        this.ptambaId =tambaRecordId;
        for(let j=0; j < this.samplelist.length; j++) {
            console.log(this.samplelist[j].id === tambaRecordId);
            if(this.samplelist[j].id === tambaRecordId){
                this.samplelist[j].ischecked =true;
            }else{
                this.samplelist[j].ischecked =false;
            }
        }
        this.isPrimaryTambaSelected =true;
        const tambaPrimary = new CustomEvent("ptambaselected", {detail: tambaRecordId});
        this.dispatchEvent(tambaPrimary);
    }
}