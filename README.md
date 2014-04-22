Spotify-Server

![Spotify-Server](https://raw.github.com/brandtabbott/spotify-server/master/public/img/Spotify-US.png)
================

While we all sit and wait for the Spotify team to make play.spotify.com work 
in IE on the Xbox/XboxOne, you can empower yourself now and run Spotify-Server
yourself.  There is NO setup required as long as you have Node.js
and NPM already installed.

I enjoy music in my living room and use the XboxOne as a media platform for my
television and gaming needs, however, I am also a Premium subscriber to 
Spotify.  Why shouldn't I be able to stream the music I pay for on the device 
of my choosing?  Spotify-Server includes an HTML5 interface complete with 
playlist view, track streaming, and search capabilities.

This is a prototype that I wrote for myself, so I'm sure it's full of awesome
bugs and incomplete in some areas, but it seems functional.

NOTE: You need to use your Spotify Username/Password to login, I have not 
implemented the Facebook login into the UI/Server

Installation
------------

Execute:

    $ npm install spotify-server
    $ cd node_modules/spotify-server

Once everything installs correctly:

    $ node spotify-server.js

From your Xbox/XboxOne goto URL:

    http://your-server-ip:3000

Caveats
-------

* Debian: Requires that you 'apt-get remove gyp' for complete installation
* OSX: Requires Xcode (now available for free in the App Store)

License
-------

Copyright (c) 2013 Brandt Abbott. Distributed under the MIT License. See
LICENSE.txt for further details.
