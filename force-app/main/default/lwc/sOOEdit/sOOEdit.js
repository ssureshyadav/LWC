/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-const-assign */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import { LightningElement, track, api, wire } from "lwc";

//import saveData from '@salesforce/apex/SOOLWC.save';
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getUserInfo from '@salesforce/apex/SOOLWCEdit.getUserInfo';
import accountName from '@salesforce/apex/SOOLWCEdit.accountName';
import userId from '@salesforce/user/Id';
import loadPrimaryTamba from '@salesforce/apex/SOOLWCEdit.loadPrimaryTamba';
import deleteSooCloneRecord from '@salesforce/apex/SOOLightningController.deleteCloneRecord';


export default class SOOEdit extends NavigationMixin(LightningElement) {
	@api recordId;
	@api isclone =false;
	@track sooId;
	@track displaySave = false;
	@track isUpdate = false;
	@track hasPSC = false;
	@track pscId;
	@track tambaselected = [];
	@track userId = userId;
	@track sooName;

	@track activeTab = "1";
	@track activeTabTopLevel = "1";
	@track opportunityId;

	@track deviceType;
	@track CustomerNode;
	@track ApplicationName;
	@track AMATProduct;
	@track revenue;
	@track TotalOpportunityTagged;

	@track hasAccess =true;
	@track isCTOUSER=false;
	@track displayreason =false;
	@track showtambatagging=true;
	@track display4a=false;
	@track display4b=false;

	@wire(getUserInfo, { userId: userId }) 
	userData({error,data}) {
		if (error) {
			this.error = error ; 
		} else if (data) {
			if(data.Profile.Name ==='Senior PSEs'){
				this.hasAccess =false;
			}else if(data.Profile.Name ==="Corp CTO User"){
				this.isCTOUSER =true;
			}
		}
	}


	connectedCallback() {
		//this.recordId = "a076C000001KCq9QAG";
		console.log(this.recordId);
		console.log(this.listWrapper);

		//
		if (this.recordId != null) {
			this.activeTabTopLevel = "1";
			this.isUpdate = true;
			this.displaySave = true;
			loadPrimaryTamba({'recordId':this.recordId})
			.then(result => {
			console.log(result);
				//this.deviceType=result.Primary_Product_Scorecard__r.Name;
			if(result != null){
				if(result.Device_Type__c != null){
					this.deviceType =result.Device_Type__r.Name;
				}
				if(result.SSG_Opportunities__r != null){
					console.log('::SSG Opportuinties::'+result.SSG_Opportunities__r.length);
					if(result.SSG_Opportunities__r.length >0){
						//console.log('SSG :::'+result.SSG_Opportunities__r[0].Opportunity_ID__c);
						this.opportunityId=result.SSG_Opportunities__r[0].Opportunity_ID__c;
					}
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
				this.revenue =result.Total_Revenue__c;
				
			}
			})
		}
	}

	handleSOOName(event){
		const account = this.template.querySelector('[data-id="accountInfo"]');
		const businessUnit = this.template.querySelector('[data-id="businessUnit"]');
		accountName({'accId':account.value})
			.then(result => {
			this.sooName =result+ " Fab X " + (businessUnit.value != null?businessUnit.value:'');
			//console.log('SOO Name::'+this.sooName);
			})
	}

	handleSegmentchange(event){
		console.log(event.target.value);
		const segmentvalue=event.target.value;
		this.handlepickistchanges(segmentvalue);
	}

	handlepickistchanges(data){
		if(data === 'AGS'){
			this.display4a =true;
			this.display4b =true;
			this.showtambatagging =false;
		}else if((data === "Corp CTO" || data === "FCL") && this.isCTOUSER) //&& programName == "FCL"
		{
			this.display4a =true;
			this.display4b =false;
			this.showtambatagging =false;
		}else{
			this.display4a =false;
			this.display4b =false;
			this.showtambatagging =true;
		}
	}

	handleLoad(event){
		//var recUi = event.getParam("recordUi");
		//console.log(recUi.record.id);
		const inputFields = this.template.querySelectorAll('lightning-input-field');
		if (inputFields) {
			inputFields.forEach(field => {
				//.fieldName + '--'+field.target.value
				if(field.fieldName ==='Segment__c' && (field.value ==='AGS' || field.value ==='Corp CTO')){
					this.handlepickistchanges(field.value);
				}else if(field.fieldName ==='Primary_Product_Scorecard__c' && field.value != null){
					this.pscId=field.value;
					this.hasPSC =true;
				}else if(field.fieldName ==='SOOClone__c' && field.value === true){
					this.isclone =true;
				}
			});
		}
	}

	handleSubmit(event) {
		event.preventDefault(); // stop form submission
		console.log('onsubmit: '+ event.detail.fields);
		const fields = event.detail.fields;
		fields.SOOClone__c = false;
		this.isclone =false;
		console.log(JSON.stringify(fields));
		this.template.querySelector('lightning-record-edit-form').submit(fields);
	}

	handleActive(event){
		console.log('handleActive::'+event.target.value);
		this.activeTab =event.target.value;
		/*if(event.target.value === '5'){
			var thingToRemove =this.template.querySelectorAll("c-sootasks")[0];
			if(thingToRemove !== undefined){
				console.log('thingToRemove::'+thingToRemove);
				thingToRemove.parentNode.removeChild(thingToRemove);
			}
		}*/
	}

	handleParentActive(event){
		this.activeTabTopLevel =event.target.value;
		console.log(this.isSOOTab);
	}

	handleTambaselected(event) {
		//console.log(event.detail);
		console.log(event.detail);
		this.tambaselected = event.detail;

		let milestones=this.template.querySelector("c-soomilestones");
        console.log('milestones:::'+milestones);
        if(milestones != null){
            this.template.querySelectorAll("c-soomilestones").forEach(element => {
				element.addTamba(event.detail);
			});
        }
		//console.log(this.template.querySelector('c-soo-milestone'));
		//this.template.querySelector("c-soomilestones").addTamba(event.detail);
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
		this.activeTabTopLevel = "2";
		this.displaySave = true;
		this.isUpdate = true;
		this.dispatchEvent(
		new ShowToastEvent({
			title: "Success",
			message: "SOO Changes has been updated",
			variant: "success"
			})
		);
	}

	hanldestatusChange(event){
		console.log(event.detail);
		console.log(event.detail.value);
		if(event.detail.value ==='Lost'){
			this.displayreason =true;
		}else{
			this.displayreason =false;
		}
	}

	handleSave(event) {
		console.log(event.detail);
		//console.log(event.detail.tabName);
		//console.log(event.detail.objName);
		/*if(event.detail.objName === 'milestone'){
		//this.template.querySelector("c-soomilestones").classList.add("hidden");
		//this.template.querySelector("c-soomilestones").remove();
		}*/
		console.log(event.detail.isparent);
		if(event.detail.isparent){
			console.log(event.detail.tabName);
			this.activeTabTopLevel = event.detail.tabName;
			if(!this.hasPSC && event.detail.tabName ==="3"){
				this.activeTabTopLevel="4";
			}
			console.log('active Tab:'+this.activeTabTopLevel);
			this.activeTab ="1";
		}else{
			this.activeTab =event.detail.tabName;
		}
		//this.activeTabTopLevel = event.detail.tabName;
		//this.activeTab ="1";
	}

	get isEVAProdTab(){
		return (this.activeTabTopLevel === '5' &&  this.activeTab === '8')?true:false;
	}

	savemodal(){
		console.log(this.activeTabTopLevel);
		console.log(this.activeTab);
		if(this.activeTabTopLevel === '1'){
			this.template.querySelector('.submitButton').click();	
		}else if(this.activeTabTopLevel === '2'){			
			this.template.querySelector("c-sootagging").saveRecords();
		}else if(this.activeTabTopLevel === '3'){
			this.template.querySelector("c-sooproductscorecard").saveRecords();
		}else if(this.activeTabTopLevel === '4'){
			if(this.activeTab === '1'){
				this.template.querySelector("c-soomilestones").saveRecords();
			}else if(this.activeTab === '2'){
				this.template.querySelector("c-soodecisionmakers").saveRecords();
			}else if(this.activeTab === '3'){
				this.template.querySelector("c-soohvps").saveRecords();
			}else if(this.activeTab === '4'){
				this.template.querySelector("c-sooareastrength").saveRecords();
			}else if(this.activeTab === '5'){
				this.template.querySelector("c-sooredflagstrategy").saveRecords();
			}else if(this.activeTab === '6'){
				this.template.querySelector("c-sootasks").saveRecords();
			}else if(this.activeTab === '7'){
				this.template.querySelector("c-sooexecutivehelp").saveRecords();
			}else if(this.activeTab === '8'){
				this.template.querySelector("c-sooeconomicvalue").saveRecords();
			}
		}else if(this.activeTabTopLevel === '5'){
			if(this.activeTab === '1'){
				this.template.querySelectorAll("c-soomilestones").forEach(element => {
					if(element.type ==='Production'){
						element.saveRecords();
					}
				});
				
			}else if(this.activeTab === '2'){
				this.template.querySelectorAll("c-soodecisionmakers").forEach(element => {
					if(element.type ==='Production'){
						element.saveRecords();}
					});
			}else if(this.activeTab === '3'){
				this.template.querySelectorAll("c-soohvps").forEach(element => {
					if(element.type ==='Production'){
						element.saveRecords();}
					});
			}else if(this.activeTab === '4'){
				this.template.querySelectorAll("c-sooareastrength").forEach(element => {
					if(element.type ==='Production'){
						element.saveRecords();
					}
				});
			}else if(this.activeTab === '5'){
				this.template.querySelectorAll("c-sooredflagstrategy").forEach(element => {
					if(element.type ==='Production'){
						element.saveRecords();}
					});
			}else if(this.activeTab === '6'){
				this.template.querySelectorAll("c-sootasks").forEach(element => {
					if(element.type ==='Production'){
						element.saveRecords();}
					});
			}else if(this.activeTab === '7'){
				this.template.querySelectorAll("c-sooexecutivehelp").forEach(element => {
					if(element.type ==='Production'){
						element.saveRecords();}
					});
			}else if(this.activeTab === '8'){
				this.template.querySelectorAll("c-sooeconomicvalue").forEach(element => {
					if(element.type ==='Production'){
						element.saveRecords();}
					});
			}
		}
	}

	completemodal(){
		var r = confirm("Are you sure you want to close!");
		if (r === false) {
			return;
		}
		/*this.template.querySelector('lightning-record-edit-form').submit();
		this.template.querySelector('lightning-record-edit-form').submit(fields);*/
		//this.template.querySelector('.submitButton').click();
		this.savemodal();
		this.closeModal();
	}

	cancelmodal(){
		var r = confirm("Are you sure you want to cancel!");
		if (r === false) {
			return;
		}
		if(this.isclone){
			console.log(this.recordId);
			/*deleteSooCloneRecord({'recordId':this.recordId})
			.then(result => {
				console.log(result);
				if(result){
					this.closeModal();  
				}
			})*/
		}else{ 
			this.closeModal();  
		}
		//
	}

	closeModal() {
		console.log("close modal");
		this[NavigationMixin.Navigate]({
			type: "standard__objectPage",
			attributes: {
			objectApiName: "SOO__c",
			actionName: "home"
			}
		});
		
		if (this.recordId != null) {
			console.log('Navigate to detail:');
				this[NavigationMixin.Navigate]({
					type: "standard__recordPage",
					attributes: {
					recordId: this.recordId,
					objectApiName: "SOO__c",
					actionName: "view"
					}
				});		
		}
		
	}
}