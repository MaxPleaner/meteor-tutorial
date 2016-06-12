import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.helpers({
  usersOnline: function() {
    let users = Meteor.users.find(
      {"status.online": true }
    )
    console.dir(users.count())
    return users
  }
})

Template.hello.onCreated(function helloOnCreated() {
  Meteor.subscribe("userStatus")
});
