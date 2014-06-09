var EventEmitter = require('events').EventEmitter,
    spotify_util = require('../node_modules/spotify-web/lib/util.js'),
    https = require('https'),
    spotify = require('spotify-web'),
    xml2js = require('xml2js');

//Override sendPong because the key may change, and I can't depend on a quick update from the authors of spotify-web
spotify.prototype.sendPong = function(ping) {
  var pong = "undefined 0";
  var input = ping.split(' ');
  if (input.length >= 20) {
    var key = [
      {idx: 8, xor: 146},
      {idx: 14, map: [54,55,56,56,57,58,59,60,61,62,62,63,64,65,66,67,68,68,69,70,71,72,73,73,74,75,76,77,78,79,79,80,81,82,83,84,85,85,86,87,88,89,90,90,91,92,93,94,95,96,96,97,98,99,100,101,102,102,103,104,105,106,107,107,0,0,1,2,3,4,5,5,6,7,8,9,10,11,11,12,13,14,15,16,17,17,18,19,20,21,22,22,23,24,25,26,27,28,28,29,30,31,32,33,34,34,35,36,37,38,39,39,40,41,42,43,44,45,45,46,47,48,49,50,51,51,52,53,163,164,164,165,166,167,168,169,170,170,171,172,173,174,175,175,176,177,178,179,180,181,181,182,183,184,185,186,187,187,188,189,190,191,192,192,193,194,195,196,197,198,198,199,200,201,202,203,204,204,205,206,207,208,209,209,210,211,212,213,214,215,215,216,108,109,110,111,112,113,113,114,115,116,117,118,119,119,120,121,122,123,124,124,125,126,127,128,129,130,130,131,132,133,134,135,136,136,137,138,139,140,141,141,142,143,144,145,146,147,147,148,149,150,151,152,153,153,154,155,156,157,158,158,159,160,161,162]},
      {idx: 17, xor: 173},
      {idx: 5, xor: 4},
      {idx: 10, xor: 178},
      {idx: 6, xor: 200},
      {idx: 4, xor: 124},
      {idx: 3, map: [232,231,230,229,236,235,234,233,224,223,222,221,228,227,226,225,248,247,246,245,252,251,250,249,240,239,238,237,244,243,242,241,200,199,198,197,204,203,202,201,192,191,190,189,196,195,194,193,216,215,214,213,220,219,218,217,208,207,206,205,212,211,210,209,29,29,29,29,30,29,29,29,28,28,28,28,29,29,29,28,31,31,31,30,31,31,31,31,30,30,30,30,30,30,30,30,26,26,26,26,26,26,26,26,25,255,254,253,26,25,25,25,28,27,27,27,28,28,28,28,27,27,27,26,27,27,27,27,36,35,35,35,36,36,36,36,35,35,35,34,35,35,35,35,37,37,37,37,38,37,37,37,36,36,36,36,37,37,37,36,32,32,32,32,33,33,33,32,32,31,31,31,32,32,32,32,34,34,34,34,34,34,34,34,33,33,33,33,34,33,33,33,42,42,42,42,42,42,42,42,41,41,41,41,42,41,41,41,44,43,43,43,44,44,44,44,43,43,43,42,43,43,43,43,39,39,39,38,39,39,39,39,38,38,38,38,38,38,38,38,40,40,40,40,41,41,41,40,40,39,39,39,40,40,40,40]},
      {idx: 7, map: [6,5,7,7,9,8,10,9,0,0,2,1,3,2,4,4,17,16,18,18,20,19,21,21,11,11,13,12,14,14,16,15,28,28,30,29,31,30,32,32,23,22,24,23,25,25,27,26,39,39,41,40,42,42,44,43,34,33,35,35,37,36,38,37,51,50,52,51,53,53,55,54,45,44,46,46,48,47,49,49,62,61,63,63,65,64,66,65,56,56,58,57,59,58,60,60,73,72,74,74,76,75,77,77,67,67,69,68,70,70,72,71,84,84,86,85,87,86,88,88,79,78,80,79,81,81,83,82,95,95,97,96,98,98,100,99,90,89,91,91,93,92,94,93,107,106,108,107,109,109,111,110,101,100,102,102,104,103,105,105,118,117,119,119,121,120,122,121,112,112,114,113,115,114,116,116,129,128,130,130,132,131,133,133,123,123,125,124,126,126,128,127,140,140,142,141,143,142,144,144,135,134,136,135,137,137,139,138,151,151,153,152,154,154,156,155,146,145,147,147,149,148,150,149,163,162,164,163,165,165,167,166,157,156,158,158,160,159,161,161,174,173,175,175,177,176,178,177,168,168,170,169,171,170,172,172]},
      {idx: 12, map: [65,68,60,63,75,78,70,73,45,47,40,42,55,57,50,52,25,27,20,22,35,37,30,32,5,7,0,2,15,17,10,12,146,148,141,143,156,158,151,153,126,128,120,123,136,138,131,133,105,108,100,103,115,118,110,113,85,88,80,83,95,98,90,93,226,229,221,224,236,239,231,234,206,209,201,204,216,219,211,214,186,189,181,183,196,199,191,194,166,168,161,163,176,178,171,173,30,30,30,30,31,32,31,31,28,28,28,28,29,29,29,29,26,26,26,26,27,27,27,27,246,249,241,244,25,25,252,254,38,39,38,38,39,40,39,39,36,37,36,36,37,38,37,37,34,35,34,34,35,36,35,35,32,33,32,32,33,34,33,33,46,47,46,46,47,48,47,47,44,45,44,44,45,46,45,45,42,43,42,42,43,44,43,43,40,41,40,40,41,42,41,41,54,55,54,54,55,56,55,55,52,53,52,52,53,54,53,53,50,51,50,50,51,52,51,51,48,49,48,48,49,50,49,49,63,63,62,62,64,64,63,63,60,61,60,60,61,62,61,61,58,59,58,58,59,60,59,59,56,57,56,56,57,58,57,57]}
    ];
    var output = new Array(key.length);
    for (var i = 0; i < key.length; i++) {
      var idx = key[i].idx,
          xor = key[i].xor,
          map = key[i].map,
          val = input[idx];
 
      output[i] = (xor) ? val ^ xor : map[val];
    }
    pong = output.join(' ');
  }
  //debug('received flash ping %j, sending pong: %j', ping, pong);
  this.sendCommand('sp/pong_flash2', [pong]);
};    
    
function SpotifyClient(username, password) {
  this.username = username;
  this.password = password;
  EventEmitter.call(this);
}

SpotifyClient.super_ = EventEmitter;
SpotifyClient.prototype = Object.create(EventEmitter.prototype, {
  constructor: {
    value: SpotifyClient,
    enumerable: false
  }
});

SpotifyClient.prototype.newInstance = function(username, password) {
  return new SpotifyClient(username, password);
};

SpotifyClient.prototype.login = function() {
  var self = this;
  spotify.login(self.username, self.password, function(err, spotify){
    if(err){
      self.emit('error', 'error');
    }
    else{
      spotify.disconnect();
      self.emit('success', 'success');
    }
  });
  return self;
};

SpotifyClient.prototype.getPlayLists = function() {
  var self = this;
  var spotifyLib = spotify;

  //Login
  console.log('Connecting to Spotify for playlists');
  spotify.login(self.username, self.password, function(err, spotify) {
    if(err)
      self.emit('error', err);

    //Rootlist
    spotify.rootlist(function(err, rootlist) {
      if(err) 
        self.emit('error', err);

      var rootItems = rootlist.contents.items;
      var rootItemsLength = rootItems.length;
      var playlists = new Array();
      
      rootItems.forEach(function(playlistObject, index){
        //Lookup playlist by uri
        //Issue #1: Only lookup items with a playlist uri
        if('playlist' == spotifyLib.uriType(playlistObject.uri)){
          spotify.playlist(playlistObject.uri, function(err, playlist) {
            if(err) 
              self.emit('error', err);

            playlist.playlistURI = playlistObject.uri;
            playlists.push(playlist);

            if(playlists.length == rootItemsLength){
              console.log('Spotify disconnecting after playlists');
              spotify.disconnect();
              self.emit('playListsReady', playlists)
            }            
          });                                           
        }
        else{
          rootItemsLength--;
        }
      });
    });
  });

  return self;  
};

SpotifyClient.prototype.getTracksByPlayListURI = function(uri) {
  var self = this;
  var spotifyLib = spotify;

  //Login
  console.log('Connecting to Spotify for playlist: '+uri);
  spotify.login(self.username, self.password, function(err, spotify) {
    if(err) 
      self.emit('error', err);

    spotify.playlist(uri, function(err, playlist) {
      if(err) 
        self.emit('error', err);

      var playlistItems = playlist.contents.items;
      var tracks = new Array();

      playlistItems.forEach(function(trackObject, index){
        //Issue #2: Only lookup items with a track uri     
        if('track' == spotifyLib.uriType(trackObject.uri)){
          //Lookup tracks by uri
          spotify.get(trackObject.uri, function(err, track){
            if(err) 
              self.emit('error', err);

            track.trackURI = trackObject.uri;
            tracks.push(track);

            if(tracks.length == playlistItems.length){
              console.log('Spotify disconnecting after playlist: '+uri);
              spotify.disconnect();
              self.emit('tracksReady', tracks);
            }              
          });
        }
      });
    });
  });   

  return self;
};

SpotifyClient.prototype.getTrackByTrackURI = function(uri){
  var self = this;
  console.log('Connecting to Spotify for /track/'+uri);
  spotify.login(self.username, self.password, function(err, spotify) {
    if(err) 
      self.emit('error', err);

    // first get a "Track" instance from the track URI
    spotify.get(uri, function(err, track) {
      if(err) 
        self.emit('error', err);

      console.log('Spotify disconnecting after /track/: '+uri);
      spotify.disconnect();
      self.emit('trackReady', track);
    });
  });

  return self;
}

SpotifyClient.prototype.getAlbumArtByTrackURI = function(uri){
  var self = this;
  self.getOembedResponseByURI(uri).on('end'+uri, function(data){
    self.emit('albumArtReady'+uri,data);
  });
  return self;
};

SpotifyClient.prototype.getOembedResponseById = function(uriType,id){
  var self = this;
  var uri = spotify_util.id2uri(uriType, id);
  self.getOembedResponseByURI(uri).on('end'+uri, function(data){
    self.emit('end'+id, data);
  });
  return self;  
};

SpotifyClient.prototype.getOembedResponseByURI = function(uri){
  var self = this;

  console.log('Connecting to Spotify OEMBED for: '+uri);
  options = {
    hostname: 'embed.spotify.com', 
    path: '/oembed/?url='+uri, 
    method: 'GET',
    headers:{
      'User-Agent': 'node.js'
    }
  };  

  var jsonData = '';

  var req = https.request(options,function(res){    
    //RESPONSE
    res.setEncoding('utf8');
    res.on('data', function(chunk){
      jsonData += chunk;
    });

    res.on('error', function(e){
      console.log('error:',e);
    });

    //RESPONSE END
    res.on('end', function(){
      self.emit('end'+uri, {itemGID: uri, oembed: JSON.parse(jsonData)});
    });  
  });

  req.on('error', function(e){
    console.log('Spotify OEMBED error after retrieving art for:'+uri+' error: '+e);
  });

  req.end();  

  return self;
}

SpotifyClient.prototype.playTrackByURI = function(uri, res){
  var self = this;

  console.log('Connecting to Spotify for /'+uri);
  spotify.login(self.username, self.password, function(err, spotify) {
    if(err) 
      self.emit('error', err);

    // first get a "Track" instance from the track URI
    spotify.get(uri, function(err, track) {
      if(err) 
        self.emit('error', err);

      console.log('Streaming: %s - %s', track.artist[0].name, track.name);

      // play() returns a readable stream of MP3 audio data
      track.play()
        .pipe(res)
        .on('error', function(e){
          console.log('Error while piping stream to client:',e);
          spotify.disconnect();
        })
        .on('unpipe', function() {
          console.log('Unpipe detected, disconnecting for /'+uri);
          spotify.disconnect();
        })
        .on('finish', function() {
          console.log('Spotify disconnecting for /'+uri);
          spotify.disconnect();
        });
    });
  });
}

SpotifyClient.prototype.search = function(query){
  var self = this;

  console.log('Connecting to Spotify for /search/'+query);  
  spotify.login(self.username, self.password, function(err, spotify) {
    if(err)
      self.emit('error', err);

    spotify.search(query,function(err,xml) {
      if(err)
        self.emit('error', err);

      console.log('Disconnecting from Spotify after /search/'+query)
      spotify.disconnect();

      var parser = new xml2js.Parser();
      parser.on('end', function(data) {
        var parseResults = self.parseSearchResults(data);

        parseResults.on('parseSearchResultsComplete', function(data){
          self.emit('searchResultsReady', data);
        });
      });      
      parser.parseString(xml);
    });    
  });  

  return self;
};

SpotifyClient.prototype.parseSearchResults = function(data){
  var self = this;
  var tracks = data.result.tracks;

  var numToReturn = 30;
  var results = new Object();
  var returnTracks = new Array();
  
  if(typeof(tracks) == 'undefined' || typeof(tracks[0].track) =='undefined' || typeof(tracks[0].track[0]) == 'undefined'){
    self.emit('searchResultsError', results);
    return self;
  }

  for(var i=0; i<numToReturn; i++){

    try{
      var trackId = tracks[0].track[i].id[0];
    }
    catch(err){
      self.emit('searchResultsError', results);
      break;
    }

    self.getOembedResponseById('track', trackId).on('end'+trackId, function(trackData){
      returnTracks.push({data: trackData});
      if(returnTracks.length==numToReturn)
        self.emit('searchTracksReady', returnTracks);
    });        
  }

  self.on('searchTracksReady', function(data){
    results.tracks = data;
    self.emit('parseSearchResultsComplete', results);
  });

  return self;
};

module.exports = new SpotifyClient();    