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
        let lat = latLng.lat, lng = latLng.lng;

        // introduce some variation into the geolocations
        // this block can be uncommented.
//           if (window.lat && window.lng) {
//               lat = window.lat.get(), lng = window.lng.get()
//             } else {
//               window.lat = new ReactiveVar(), window.lng = new ReactiveVar()
//             }
//             if (!(window.geolocationRandomnessInterval)) {
//               window.geolocationRandomnessInterval = window.setInterval(function() {
//                 window.lat.set(Math.random() * 180)
//                 window.lng.set(Math.random() * 180)
//                 Meteor.call("updateUser", {
//                   _id: user._id, latitude: window.lat, longitude: window.lng
//                 })
//               }, 1000)
//             }

        Meteor.call("updateUser", {
          _id: user._id, latitude: lat, longitude: lng
        })
      }
    })
  });
})