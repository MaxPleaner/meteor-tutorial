import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});


Accounts.onCreateUser(function(options, user) {
    user.latitude = options.latitude || null
    user.longitude = options.longitude || null
    return user
})

Meteor.publish("userStatus", function() {
  if (this.userId) {
    return Meteor.users.find(
      { "status.online": true },
      { fields: { latitude: 1, longitude: 1, email: 1 } }
    );
  } else { return [] }
});

Meteor.methods({
  updateUser(user) {
    console.dir(user)
    if (user._id && (Meteor.userId() == user._id)) {
      var id = user._id
      delete user._id
      var keysAreValid = Object.keys(user).every((field) => {
        return ["latitude", "longitude"].indexOf(field) != -1
      })
      if (keysAreValid) {
        Meteor.users.update(id, { $set: user, });
      }  else {
        throw new Error("invalid update fields to user")
      }
    } else {
      throw new Error("invalid userId to update user")
    }
  }
})