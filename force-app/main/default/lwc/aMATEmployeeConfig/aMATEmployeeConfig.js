/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-eval */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable vars-on-top */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
import { LightningElement, track,wire } from 'lwc';
import fetchemployees from '@salesforce/apex/AMATEmployee.fetchEmployees';
import fetchEmpchildList from '@salesforce/apex/AMATEmployee.fetchChildlist';
//import fetchFieldsList from '@salesforce/apex/RollupSummary.fetchFieldsList';

//import saveRecords from '@salesforce/apex/RollupSummary.saveRecords';
//import fetchRollSummary from '@salesforce/apex/RollupSummary.fetchRollSummary';
//import deleteRollRecord from '@salesforce/apex/RollupSummary.deleteRollRecord';

//import { ShowToastEvent } from 'lightning/platformShowToastEvent'
const DELAY = 350;
export default class AMATEmployeeConfig extends LightningElement {

    @track employeeRecords;
    @track selectedEmployee;
    @track employeeSelected;

    /*@track rollupRecords;
    @track refresh;
    //List
   
    @track childObjects;
    @track objectFields;

    //String
    
    @track selectedChildObject;
    @track selectedSummaryType;
    @track selectedField;

    //Bool
    
    @track childObjSelected;
    @track displayobjectFields;
    @track displaysaveButton;*/

    @track dynamiccmpcount=[{label :"1",value:""}];

    //@wire(getContactList) contacts;
    @wire(fetchemployees)
    fetchemployees({ error, data }) {
        if (data) {
            var newObjs = [];
            var obj = {};
            console.log(data);
            console.log(data.length);
            obj = {label : '--Select--', value: '--Select--'}
            newObjs.push(obj);
            for(var i=0; i < data.length ; i++)
            {
                obj = {label : data[i].Name, value: data[i].Id}
                newObjs.push(obj);
            }
            this.employeeRecords = newObjs;
        } else if (error) {
            console.log('Error Message');
            console.log(this.error.label.value);
            this.error = error;
            this.employeeRecords = undefined;
        }
    }

    connectedCallback() {
        
		//this.fetchrollupRecords();
    }

    handleParentObjectChange(event){
        console.log(event.target.value);
        
        const empRecord =event.target.value;
        this.selectedEmployee =empRecord;
        this.employeeSelected = true;
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            fetchEmpchildList({ empRecord })
                .then(result => {
                    console.log(result);
                    var newObjs = [];
                    var obj = {};
                    console.log(result);
                    console.log(result.length);
                    obj = {label : '--Select--', value: '--Select--'}
                    newObjs.push(obj);
                    for(var i=0; i < result.length ; i++)
                    {
                        obj = {label : result[i].objLabel, value: result[i].objName}
                        newObjs.push(obj);
                    }
                    this.childObjects = newObjs;
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                    this.childObjects = undefined;
                });
        }, DELAY);
    }

    handleEdit(event){
        alert(event.target.title);
    }

    /*handleDelete(event){
        deleteRollRecord({rollName:event.target.title})
			.then(result => {
				alert(result);
			})
			.catch(error => {
				this.error = error;
			});
    }
    
	fetchrollupRecords() {
		fetchRollSummary()
			.then(result => {
				this.rollupRecords = result;
			})
			.catch(error => {
				this.error = error;
			});
    }*/
    
    /*@wire(fetchRollSummary)
    rollupRecords({ error, data }){
        if (data) {
            //this.rollupRecords =data;
            console.log(data);
            console.log(data.length);
            this.error = undefined;
        } else if (error) {
            console.log('Error Message');
            console.log(this.error.label.value);
            this.error = error;
            this.parentObjects = undefined;
        }
    }*/

    
    /*

    get condition() {
        return (this.selectedChildObject!=null) ? true : false;
    }

    get summaryOptions() {
        return [
            { label: 'COUNT', value: 'COUNT' },
            { label: 'SUM', value: 'SUM' },
            { label: 'MIN', value: 'MIN' },
            { label: 'MAX', value: 'MAX' },
        ];
    }

    

    handleSummaryTypeChange(event){
        console.log(event.detail.value);
        this.selectedSummaryType =event.detail.value;
        //this.selectedSummaryType
        window.clearTimeout(this.delayTimeout);
        const objName = this.selectedChildObject;
        const summaryType=this.selectedSummaryType;

        if(summaryType !== "COUNT"){
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.delayTimeout = setTimeout(() => {
                fetchFieldsList({ objName,summaryType })
                    .then(result => {
                        console.log(result);
                        console.log(result.length);
                        this.displayobjectFields =false;
                        if(result.length >0){
                            this.displayobjectFields =true;
                        }
                        var newObjs = [];
                        var obj = {};
                        console.log(result);
                        console.log(result.length);
                        obj = {label : '--Select--', value: '--Select--'}
                        newObjs.push(obj);
                        for(var i=0; i < result.length ; i++)
                        {
                            console.log(result[i].objLabel);
                            obj = {label : result[i].objLabel, value: result[i].objName}
                            newObjs.push(obj);
                        }
                        this.objectFields = newObjs;
                        this.error = undefined;
                    })
                    .catch(error => {
                        this.error = error;
                        this.objectFields = undefined;
                    });
            }, DELAY);
        }else{
            this.displaysaveButton =true;
            this.displayobjectFields =false;
            this.selectedField ='';
        }
    }

    handlechildObjectChange(event) {
        //console.log('this.selectedContact:::'+this.selectedContact);
        console.log('event.detail:'+event.target.value);
        this.selectedChildObject =event.target.value;
    }

    handleFieldChange(event){
        console.log('event.detail:'+event.target.value);
        this.selectedField = event.target.value;
        this.displaysaveButton =true;
    }

    handleSaveClick(event){
        console.log(event.target.value);
        console.log(this.selectedParentObject);
        console.log(this.selectedChildObject);
        console.log(this.selectedField);
        console.log(this.selectedSummaryType);
        var rollupfields=''; 
        for(var i=0; i < this.dynamiccmpcount.length; i++) {
            rollupfields += this.dynamiccmpcount[i].value + ','; 
         }
         console.log(rollupfields);
         rollupfields=rollupfields.substring(0, rollupfields.length - 1);
         console.log(rollupfields);
        var parentValue =this.selectedParentObject;
        var childValue=this.selectedChildObject;
        var summaryType=this.selectedSummaryType;

        
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            saveRecords({ parentValue,childValue, summaryType,rollupfields})
                .then(result => {
                    console.log(result);
                    const toastMsg = new ShowToastEvent({
                        title: 'Get Help',
                        message: result,
                    });
                    this.dispatchEvent(toastMsg);
                    this.error = undefined;
                    /*this.delayTimeout = setTimeout(() => {
                        eval("$A.get('e.force:refreshView').fire();");
                    }, DELAY);*
                })
                .catch(error => {
                    this.error = error;
                });
        }, DELAY);
    }

    mutatorMethod() {
        //use spread operator (immutable data structure, do not use .push() )
        let r = Math.random().toString(36).substring(7);
        console.log("random", r);
        this.displaysaveButton =true;
        this.dynamiccmpcount = [
            ...this.dynamiccmpcount,
            {
                label:  r,   //maybe use index?
                value: ""
            }
        ];
    }

    hanldepicklistvaluechange(event){
        //console.log('Parent: hanldepicklistvaluechange::::'+event.detail);
        var res = event.detail.split("--");
        //Find index of specific object using findIndex method.    
        const objIndex = this.dynamiccmpcount.findIndex((obj => obj.label === res[1]));

        //Update object's name property.
        this.dynamiccmpcount[objIndex].value = res[0];
    }

    handledeletedvalue(event){
        //console.log('Parent: handledeletedvalue::::'+event.detail);
        for(var i=0; i < this.dynamiccmpcount.length; i++) {
            if(this.dynamiccmpcount[i].label === event.detail)
            {
                this.dynamiccmpcount.splice(i,1);
            }
         }
    }*/
}