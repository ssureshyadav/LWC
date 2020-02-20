/* eslint-disable no-const-assign */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import { LightningElement, track, api, wire } from "lwc";

//import saveData from '@salesforce/apex/SOOLWC.save';
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import loadPrimaryTamba from '@salesforce/apex/SOOLWCEdit.loadPrimaryTamba';

export default class Demo extends NavigationMixin(LightningElement) {
  @api recordId;
  @track sooId;
  @track displaySave = false;
  @track isUpdate = false;
  @track hasPSC = true;
  @track pscId;
  @track tambaselected = [];

  @track activeTab = "1";

  @track deviceType;
  @track CustomerNode;
  @track ApplicationName;
  @track AMATProduct;
  @track TotalOpportunityTagged;
  

  connectedCallback() {
    this.recordId = "a076C000001KCq9QAG";
    console.log(this.recordId);
    console.log(this.listWrapper);
    //
    if (this.recordId != null) {
      this.activeTab = "1";
      this.isUpdate = true;
      this.displaySave = true;
      loadPrimaryTamba({'recordId':this.recordId})
            .then(result => {
              console.log(result);
              this.deviceType=result.Primary_Product_Scorecard__r.Name;
                if(result.Device_Type__c != null){
                    this.deviceType =result.Device_Type__r.Name;
                }
                if(result.Customer_Node__c != null){
                    this.CustomerNode =result.Customer_Node__r.Name;
                }

                if(result.Application_Name_Customer__c != null){
                    this.ApplicationName =result.Application_Name_Customer__r.Name;
                }

                if(result.AMAT_Product_G3__c != null){
                    this.AMATProduct =result.AMAT_Product_G3__r.Name;
                }

                /*if(result.Device_Type__c != null){
                    this.deviceType =result.Device_Type__r.Name;
                }*/

            })
            .catch(error => {
                this.error = error;
            });
    }
  }

  closeModal() {
    console.log("close modal");
    if (this.recordId != null) {
      this[NavigationMixin.Navigate]({
        type: "standard__recordPage",
        attributes: {
          recordId: this.recordId,
          objectApiName: "SOO__c",
          actionName: "view"
        }
      });
    } else {
      this[NavigationMixin.Navigate]({
        type: "standard__objectPage",
        attributes: {
          objectApiName: "SOO__c",
          actionName: "home"
        }
      });
    }
  }

  handleActive(event){
    console.log(event.target.value);
    this.activeTab =event.target.value;
  }

  handleTambaselected(event) {
    //console.log(event.detail);
    console.log(event.detail);
    this.tambaselected = event.detail;
    //console.log(this.template.querySelector('c-soo-milestone'));
    this.template.querySelector("c-soomilestones").addTamba(event.detail);
  }

  handleproductscorecard(event){
    console.log('handleproductscorecard');
    console.log(event.detail);
    if(event.detail ===''){
      this.hasPSC =false;
    }else{
      this.hasPSC =true;
      this.pscId =event.detail;
    }
  }

  /*handleSoo(event){
    console.log('handleSoo');
      const fields = event.detail.fields;
        console.log(JSON.stringify(fields));
  }*/

  handleSuccess(event) {
    this.sooId = event.detail.id;
    this.recordId = event.detail.id;
    console.log(this.sooId);
    console.log(this.recordId);
    this.activeTab = "2";
    this.displaySave = true;
    this.isUpdate = true;
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: event.detail.apiName + " created.",
        variant: "success"
      })
    );
  }

  handleSave(event) {
    console.log(event.detail);
    //console.log(event.detail.tabName);
    //console.log(event.detail.objName);
    /*if(event.detail.objName === 'milestone'){
      //this.template.querySelector("c-soomilestones").classList.add("hidden");
      //this.template.querySelector("c-soomilestones").remove();
    }*/
    this.activeTab = event.detail;
  }
}