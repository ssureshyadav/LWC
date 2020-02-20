/* eslint-disable no-undef */
/* eslint-disable guard-for-in */
/* eslint-disable dot-notation */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import { LightningElement,track } from 'lwc';

export default class Demo1 extends LightningElement {

    @track samplelist=[];

    connectedCallback(){
        this.samplelist.push({
            ischecked : false,
            Name : 'suresh',
        });
        this.samplelist.push({
            ischecked : false,
            Name : 'Mahesh',
        });
        this.samplelist.push({
            ischecked : false,
            Name : 'Demo',
        });
        this.samplelist.push({
            ischecked : false,
            Name : 'Hello',
        });
        console.log(this.samplelist);
    }

    handlechange(event){
        console.log(event.target.dataset.value);
        if(event.target.checked){
            for(let j=0; j < this.samplelist.length; j++) {
                console.log(this.samplelist[j].Name);
                console.log(this.samplelist[j].Name !== event.target.dataset.value);
                if(this.samplelist[j].Name === event.target.dataset.value){
                    this.samplelist[j].ischecked =true;
                }else{
                    this.samplelist[j].ischecked =false;
                }
             }
             for(let j=0; j < this.samplelist.length; j++) {
                 console.log(this.samplelist[j].ischecked);
                if(this.samplelist[j].ischecked){
                    console.log(this.samplelist[j].Name);
                }
             }
             
        }
    }


}