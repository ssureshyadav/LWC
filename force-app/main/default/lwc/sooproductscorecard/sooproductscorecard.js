/* eslint-disable no-console */
import { LightningElement,api,track } from 'lwc';

import loadPSC from '@salesforce/apex/SOOLWCEdit.loadPSC';

export default class Sooproductscorecard extends LightningElement {

    @track bubm=false;
    @api pscid;
    @api recordId;
    @track hasCompetitor;
    @track MaxNowDPYDiff;
    @track MaxNowCoODiff;
    @track NowTotalDiff;
    @track FutureTotalDiff='N/A';
    @track total;
    @track coo;
    @track dpy;
    @track soo;
    @track MaxFutureDPYDiff='N/A';
    @track MaxFutureCoODiff='N/A';
    @track psc;
    @track pscLastModifiedDate;

    handleBUBM(event){
        console.log(event.detail);
        console.log(event.detail.checked);
        this.bubm =event.detail.checked;
    }

    handleSaveClick(){
        //this.save();
        const nextTab = new CustomEvent("save", {
            detail : {tabName : '4' , isparent : true}
        });
        this.dispatchEvent(nextTab);
    }

    @api
    saveRecords(){
        console.log('SOO Productscorecard Save');
        this.template.querySelector('.submitButton').click();
    }

    connectedCallback(){
        console.log(this.recordId);
        loadPSC({'recordId':this.recordId})
            .then(result => {
                this.psc=result.primaryScorecard;
                const dt=new Date(this.psc.LastModifiedDate).toLocaleDateString("en-US");
                this.pscLastModifiedDate =dt;
                
                if(result.competitorhighestValueField === undefined){
                    this.hasCompetitor ='(AMAT)';
                }else{
                    if(result.competitorhighestValueField.startsWith('Competitor')){
                        this.hasCompetitor ='Diff (AMAT - Comp)';
                    }else{
                        this.hasCompetitor ='Diff (AMAT - AMAT)';
                    }
                }
                this.MaxNowDPYDiff =this.psc.Max_Now_DPY_Diff__c;
                this.MaxNowCoODiff =this.psc.Max_Now_CoO_Diff__c;
                if(this.psc.Max_Now_DPY_Diff__c !== undefined && this.psc.Max_Now_CoO_Diff__c !== undefined){
                    this.NowTotalDiff =this.psc.Max_Now_DPY_Diff__c + this.psc.Max_Now_CoO_Diff__c;
                }
                if(this.psc.Max_Future_DPY_Diff__c !== undefined && this.psc.Max_Future_CoO_Diff__c !== undefined){
                    this.FutureTotalDiff =this.psc.Max_Future_DPY_Diff__c + this.psc.Max_Future_CoO_Diff__c;
                }

                const compfutureHighestField=result.competitorFuturehighestValueField;
                const amatfutureHighestField=result.amatFuturehighestValueField;

                if(amatfutureHighestField ==='AMAT_Product_1_Weighted_Score__c'){
                    this.futureDPYDIff =this.psc.Total_Score_AMAT_Product_1__c;
                }else if(amatfutureHighestField ==='AMAT_Product_2_Weighted_Score__c'){
                    this.futureDPYDIff =this.psc.Total_Score_AMAT_Product_2__c;
                }else if(amatfutureHighestField ==='AMAT_Product_3_Weighted_Score__c'){
                    this.futureDPYDIff =this.psc.Total_Score_AMAT_Product_3__c;
                }else if(amatfutureHighestField ==='AMAT_Product_4_Weighted_Score__c'){
                    this.futureDPYDIff =this.psc.Total_Score_AMAT_Product_4__c;
                }

                if(compfutureHighestField ==='Competitor_Product_1_Weighted_Score__c'){
                    this.futureCOODIff =this.psc.Total_Score_Comp_Product_1__c;
                }else if(compfutureHighestField ==='Competitor_Product_2_Weighted_Score__c'){
                    this.futureCOODIff =this.psc.Total_Score_Comp_Product_2__c;
                }else if(compfutureHighestField ==='Competitor_Product_3_Weighted_Score__c'){
                    this.futureCOODIff =this.psc.Total_Score_Comp_Product_3__c;
                }else if(compfutureHighestField ==='Competitor_Product_4_Weighted_Score__c'){
                    this.futureCOODIff =this.psc.Total_Score_Comp_Product_4__c;
                }
                
                if(this.futureCOODIff>0){
                    this.MaxFutureDPYDiff =this.psc.Max_Future_DPY_Diff__c;
                    this.MaxFutureCoODiff =this.psc.Max_Future_CoO_Diff__c;
                }
                if(this.futureDPYDIff === 0 || this.futureDPYDIff === undefined){
                    this.MaxFutureDPYDiff ='N/A';
                    this.MaxFutureCoODiff ='N/A';
                    this.FutureTotalDiff ='N/A';
                }

                this.dpy =result.dpy*100;
                this.coo =result.coo*100;
                this.total =(this.dpy - this.coo);
            })
            .catch(error => {
                this.error = error;
                this.accounts = undefined;
            });
    }
}