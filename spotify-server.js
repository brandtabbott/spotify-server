var express = require('express'),
    session = require('express-session');
    cookieParser = require('cookie-parser');  
    http = require('http'),
    ejs = require('ejs'),
    path = require('path'),
    spotifyClient = require('./lib/client'),
    color = require('tinycolor');

//Don't stop this server if an exception goes uncaught
process.on('uncaughtException', function (err) {
  console.error((err.stack+'').red.bold);
  console.error('Node trying not to exit...'.red.bold);
});     

var app = express();
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cookieParser('asdklfjl43u8t943htinjgkrenseiro3u8urijoewfdkls'));
app.use(session());

//Index
app.get('/', function(req, res){
  res.render('index');
});

app.get('/spotify-server/logout', function(req,res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

//Get login information
app.get('/spotify-server/login/:usernameAndpassword', function(req, res){
  var up = req.params.usernameAndpassword;
  var uname = up.split(':')[0];
  var pw = up.split(':')[1];

  if(req.session.loggedin && uname=='check'){
    res.send({success: 'success'});
    return;
  }

  if(!req.session.loggedin && uname=='check'){
    res.send({error: {message: "invalid login"}});
    return;
  }

  spotifyClient.newInstance(uname,pw).login()
  .on('error', function(e){
    res.send({error: {message: "invalid login"}});
  })
  .on('success', function(data){
    req.session.username = uname;
    req.session.password = pw;
    req.session.loggedin = true;
    res.send({success: 'success'});
  });
});

//Retrieve PlayLists
app.get('/spotify-server/playlists', function(req, res){
  spotifyClient.newInstance(req.session.username,req.session.password).getPlayLists().on('playListsReady', function(playlists){
    res.send({playlists: playlists});
  });
});

//Retrieve tracks for a given PlayList
app.get('/spotify-server/playlist/:playlistid', function(req, res){
  var playlistid = req.params.playlistid;
  var uri = 'spotify:user:'+req.session.username+':playlist:'+playlistid;

  spotifyClient.newInstance(req.session.username,req.session.password).getTracksByPlayListURI(uri).on('tracksReady', function(tracks){
    res.send({tracks: tracks});
  }); 
});

//Retrieve a single track
app.get('/spotify-server/track/:trackURI', function(req, res){
  var uri = req.params.trackURI;

  spotifyClient.newInstance(req.session.username,req.session.password).getTrackByTrackURI(uri).on('trackReady', function(track){
    res.send(track);
  })
});

//Retreive album art for a given track
app.get('/spotify-server/album-art/:trackURI', function(req, res){
  var trackURI = req.params.trackURI;

  spotifyClient.newInstance(req.session.username,req.session.password).getAlbumArtByTrackURI(trackURI).on('albumArtReady'+trackURI, function(data){
    res.send(data);
  });
});

//Search (tracks only right now)
app.get('/spotify-server/search/:query', function(req,res){
  var query = req.params.query;
  spotifyClient.newInstance(req.session.username,req.session.password).search(query)
  .on('searchResultsReady', function(data){
    res.send(data);
  })
  .on('searchResultsError', function(e){
    res.send({error: 'searchResultsError'});
  })
});

//Play a track
app.get('/:trackId.mp3', function(req, res){
  var trackURI = req.params.trackId;

  //Just pass the response here because we need to stream to it
  spotifyClient.newInstance(req.session.username,req.session.password).playTrackByURI(trackURI, res); 
});


var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Listening on port',app.get('port'));
});