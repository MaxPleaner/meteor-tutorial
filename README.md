## About

This is a project I undertook to learn Meteor.

I had previously build a site with much of the same functionality using Express.

Needless to say, that took __way__ more effort and has many more lines of code. That project can be seen at [https://github.com/maxpleaner/marktplatz](https://github.com/maxpleaner/marktplatz).

## What it does

In summary, when a User signs in, they see themself and all other signed in users plotted on a map.

- It has Meteor's accounts system, which I didn't have to write much code for.
- It uses the [mizzao:meteor-user-status](https://github.com/mizzao/meteor-user-status) package to publish a list of online users to the client.
- It uses the [dburles:google-maps](https://atmospherejs.com/dburles/google-maps) and [mdg:geolocation](https://atmospherejs.com/mdg/geolocation) packages to geolocate users and plot them on a map.

## How was it built

I Google stuff so frequently that I can't give thanks to all the tutorials and stackoverflow questions that helpers me.

These resources were particularly useful, though:

- [reactive-geolocation-with-google-maps/](http://meteorcapture.com/reactive-geolocation-with-google-maps/)
- [reactivity-basics-meteors-magic-demystified/](https://www.discovermeteor.com/blog/reactivity-basics-meteors-magic-demystified/)
- [custom-fields-on-meteor-users-not-being-published](http://stackoverflow.com/questions/19391308/custom-fields-on-meteor-users-not-being-published)
- [meteor-methods-client-side-operations/](https://www.discovermeteor.com/blog/meteor-methods-client-side-operations/)
- [meteor-google-maps](https://github.com/dburles/meteor-google-maps)

## How to run

Clone the repo and `meteor run`.

## Where is the source code

There are just four files in here. Not so intimating, right?

- [client/main.css](./client/main.css)
- [client/main.html](./client/main.html)
- [client/main.js](./client/main.js)
- [server/main.js](./server/main.js)