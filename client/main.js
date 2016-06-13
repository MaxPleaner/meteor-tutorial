import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

// Subscribe to a list of online users
// Unless a user is signed in, this publication will be an empty array
Meteor.startup(function(){
    Meteor.subscribe("userStatus")
})

// Load the Google Map when the template is rendered.
Template.map.onRendered(function() {
  GoogleMaps.load( { v: '3', key: 'AIzaSyD_eSUViM3ppuaIXVzpCnkVELAPYQ2XWMY' } );
});

// Initialization options for Google Maps
Template.map.helpers({
  exampleMapOptions: function() {
    if (GoogleMaps.loaded()) {
      return { center: new google.maps.LatLng(-37.8136, 144.9631), zoom: 1 };
    }
  },
});

Template.map.onCreated(function(){
  // Pass "this" to other scopes by assigning it a variable
  var self = this
  // Callback when Google Maps is ready
  GoogleMaps.ready('map', function(map) {
    // An autorun scope will re-evaluate if reactive variables inside it change.
    // Here, there are two reactive variables:
    //     - Geolocation.latlng()
    //     - the custom ReactiveVars in window.lat and window.lng
    self.autorun(function(){
      // First, get all the users and put them on the map
      // This lookup will only include online users, because only they are published
      Meteor.users.find(
        {}, { fields: { latitude: 1, longitude: 1, emails: 1 } }
      ).forEach(function(user){
        // define a "markers" variable on the template which tracks which tracks user/marker association
        if (!(self.markers)) { self.markers = {} } // initialize markers if undefined
        if (!(self.markers[user._id])) {
          // if there isn't a marker for the user yet, create one
          self.markers[user._id] = new google.maps.Marker({
            position: new google.maps.LatLng(user.latitude, user.longitude),
            map: map.instance
          });
        } else {
          // If there's already a marker for the user, update the position
          self.markers[user._id].setPosition({lat: user.latitude, lng: user.longitude})
        }
      })
      // Next, setup reactive variables
      var latLng = Geolocation.latLng();
      if (! latLng) { return; }
      var user = Meteor.user()
      if (user) {
        if (!window.lat || !window.lng) {
          // reactive variables stored on the window object
          window.lat = new ReactiveVar(latLng.lat), window.lng = new ReactiveVar(latLng.lng)
        }
        // introduce some variation into the geolocations
        // this block can be commented/uncommented.
        if (!(window.geolocationRandomnessInterval)) {
          window.geolocationRandomnessInterval = window.setInterval(function() {
            window.lat.set(Math.random() * 50)
            window.lng.set(Math.random() * 50)
          }, 1000)
        }
        // Call updateUser at the end of the autorun block.
        // Since the autorun function will rerun if one of its reactive variables changes,
        // this updateUser call will be made with different values each time.
        Meteor.call("updateUser", {
          _id: user._id, latitude: lat.get(), longitude: lng.get()
        })
      }
    })
  });
})