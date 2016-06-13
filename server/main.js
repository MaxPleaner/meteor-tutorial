import { Meteor } from 'meteor/meteor';

// Publish a list of all signed in users. 
// Only publish this to authenticated users
Meteor.publish("userStatus", function() {
  // If there is a current user signed in
  if (this.userId) {
    // Publish all online users to the client.
    return Meteor.users.find(
      // Use a lookup attribute is provided by the mizzao:meteor-user-status package
      // to find which users are online
      { "status.online": true },
      // Specify custom fields to include while publishing
      { fields: { latitude: 1, longitude: 1, emails: 1 } }
    );
    // If no user is signed in, return an empty array
  } else { return [] }
});

// Methods which are called from the client
Meteor.methods({
  updateUser(user) {
    // If the user being edited is also signed in
    if (user._id && (Meteor.userId() == user._id)) {
      var id = user._id
      delete user._id
      // Check that all the keys are allowed to be updated 
      // The user._id key is first deleted so that this check can pass.
      var keysAreValid = Object.keys(user).every((field) => {
        // Only allow latitude and longitude to be updated
        return ["latitude", "longitude"].indexOf(field) != -1
      })
      if (keysAreValid) {
        // Send an update to the server if the keys are acceptable
        Meteor.users.update(id, { $set: user, });
      }  else {
        // Throw an error if the keys are invalid
        throw new Error("invalid update fields to user")
      }
    } else {
      // Throw an error if the user being updated isn't signed in
      throw new Error("invalid userId to update user")
    }
  }
})