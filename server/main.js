import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true }, {fields: {email : 1, status : 1}});
});