import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';
import {Tasks} from '../imports/Api/tasks.js';
import './main.html';
import '../imports/ui/task.js';

Template.body.onCreated(function bodyOnCreated(){
	this.state = new ReactiveDict();
});

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();  
},
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});


Template.body.helpers({
	tasks() {
		const instance = Template.instance();

		//if hide is checked filter tasks
		if (instance.state.get('hideCompleted')){
			return Tasks.find({checked:{ $ne:true }  } );
		}
		return Tasks.find({});
	},
});
Template.body.events ({
	//new task is the class name of the form we created
	'submit .new-task'(event){
	
	//prevenet default browser form submit
	event.preventDefault();
	

	//Get value from form
	const target = event.target;
	const text = target.text.value;

	//add new task to collection
	Tasks.insert({
		text,
		createdAt: new Date(),
	});

	//Clear form
	target.text.value='';
 },
	'change .hide-completed input' (event,instance){
		instance.state.set('hideCompleted',event.target.checked);
	},
});

