/* eslint-disable no-console */
import { LightningElement,track,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class ParentDemo extends NavigationMixin(LightningElement) {

    @track demoValue='test';

    @api 
    save(){
        console.log('parent');
    }
}