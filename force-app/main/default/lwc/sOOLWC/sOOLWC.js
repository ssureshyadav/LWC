/* eslint-disable no-const-assign */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import { LightningElement, track, api, wire } from "lwc";

//import saveData from '@salesforce/apex/SOOLWC.save';
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class SOOLWC extends NavigationMixin(LightningElement) {
  @api recordId;
  @track sooId;
  @track displaySave = false;
  @track isUpdate = false;
  @track tambaselected = [];

  @track activeTab = "1";

  

  connectedCallback() {
    this.recordId = "a076C000001KCq9QAG";
    console.log(this.recordId);
    console.log(this.listWrapper);
    //
    if (this.recordId != null) {
      this.activeTab = "6";
      this.isUpdate = true;
      this.displaySave = true;
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

  handleTambaPriority(event) {
    console.log(event.target.value);
    const accId = this.template.querySelector('[data-id="accountInfo"]').value;
    const businessvalue = this.template.querySelector('[data-id="businessUnit"]').value;
    const priority = event.target.value;

    if (accId === "" || accId === null) {
      alert("Account should not be null");
      return;
    }

    if (businessvalue === "" || businessvalue === null) {
      alert("BusinessUnit should not be null");
      return;
    }
    this.template.querySelector("c-soo-tamba").fetchRecords(accId, businessvalue, priority);
  }

  handleTambaselected(event) {
    //console.log(event.detail);
    this.tambaselected = event.detail;
    //console.log(this.template.querySelector('c-soo-milestone'));
    this.template.querySelector("c-soomilestones").addTamba(event.detail);
  }

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
