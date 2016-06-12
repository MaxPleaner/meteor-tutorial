import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.helpers({
  
  usersOnline() {
    return Meteor.users.find(
      {"status.online": true },
    )
  },
      
  emailString(emails) {
    return emails.map(email => {return email.address}).join(", ")
  },
    
})

Template.hello.onCreated(function helloOnCreated() {
  Meteor.subscribe("userStatus")
});
