import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Meteor.startup(function(){
    Meteor.subscribe("userStatus")
})

const MAP_ZOOM = 15;

Template.map.onRendered(function() {
  console.log("map rendered")
  GoogleMaps.load( { v: '3', key: 'AIzaSyD_eSUViM3ppuaIXVzpCnkVELAPYQ2XWMY' } );
});

Template.map.helpers({
  exampleMapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 1
      };
    }
  },
});

Template.map.onCreated(function(){
  var self = this
  GoogleMaps.ready('map', function(map) {
    self.autorun(function(){
      // destroy all markers
      Meteor.users.find(
        {}, { fields: { latitude: 1, longitude: 1, emails: 1 } }
      ).forEach(function(user){
        console.log(user)
        if (!(self.markers)) { self.markers = {} }
        if (!(self.markers[user._id])) {
          self.markers[user._id] = new google.maps.Marker({
            position: new google.maps.LatLng(user.latitude, user.longitude),
            map: map.instance
          });
        } else {
          self.markers[user._id].setPosition({lat: user.latitude, lng: user.longitude})
        }
      })
      var latLng = Geolocation.latLng();
      if (! latLng) { return; }
      var user = Meteor.user()
      if (user) {
        Meteor.call("updateUser", {
//           _id: user._id, latitude: latLng.lat, longitude: latLng.lng
          _id: user._id, latitude: (Math.random() * 180), longitude: (Math.random() * 180)
        })
      }
    })
  });
})