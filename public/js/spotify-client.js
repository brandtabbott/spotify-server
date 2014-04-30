var getPlayLists, //function
    getPlayListTracks, //function
    getAlbumArt, //function
    renderHandlebarsTemplate, //function
    highlighTrackRow, //function
    playNextTrack, //function
    playTack, //function
    playlists, //object
    tracks, //object
    customTrackQueue = new Array(),
    currentTrack = 0;

$(document).ready(function(){
  if(typeof($.cookie('username')) != 'undefined')
    $('#username').val($.cookie('username'))

  if(typeof($.cookie('password')) != 'undefined')
    $('#password').val($.cookie('password'));

  $.ajax({
    cache: "false",
    dataType: "json",
    url: '/spotify-server/login/check:check',
    beforeSend: function() {
      $('.modal').modal('show');
    }            
  }).done(function(data){  
    if(data.success){
      $('#nav').show();
      $('.login-wrapper').hide();
      getPlayLists();        
    }
    else{
      $('.login-wrapper').show();
      $('.modal').modal('hide');
    }       
  }); 

  //Event handlers for play/pause/nextTrack/track clicks
  $(document).click(function(e){
    //Handler for each Playlist link
    if(e.target.name==='playListLink'){
      e.preventDefault();  
      getPlayListTracks(e.target.id);
    }
    //Handler for playAudio button
    else if(e.target.id==='playAudio'){
      e.preventDefault();
      $('#audioPlayer').get(0).play();
    }
    //Handler for pauseAudio button
    else if(e.target.id==='pauseAudio'){
      e.preventDefault();
      $('#audioPlayer').get(0).pause();
    }
    //Handler for nextTrack button
    else if(e.target.id==='nextTrack'){
      e.preventDefault();
      currentTrack++;
      loadTrack();
    }
    else if(e.target.id==='previousTrack'){
      e.preventDefault();
      currentTrack--;
      loadTrack();
    }
    //Handler for enqueueing a track from search
    else if(e.target.className==='enqueueTrack'){
      var id = e.target.id;
      e.preventDefault();      
      $.ajax({
        cache: "false",
        dataType: "json",
        url: '/spotify-server/track/'+id,
        beforeSend: function() {
          $('.modal').modal('show');
        }            
      }).done(function(data){  
        //Build custom queue
        var firstSong = false;

        if(customTrackQueue.length==0){
          firstSong = true;
        }

        //If customTrackQueue is empty, we need to make one
        if(typeof(tracks)=='undefined'){
          tracks = new Object();
        }

        if(typeof(tracks.tracks)=='undefined'){
          tracks.tracks = new Array();
        }

        customTrackQueue.push(data);        
        tracks.tracks = customTrackQueue;
        tracks.tracks[customTrackQueue.length-1].trackURI = id;

        if(firstSong == true){
          currentTrack = 0;
          loadTrack();
        }

        $('.modal').modal('hide'); 
      });        
    }      
  });  

  getPlayLists = function() {
    //Get Playlists
    $.ajax({
      cache: "false",
      dataType: "json",
      url: '/spotify-server/playlists',
      beforeSend: function() {
        $('.modal').modal('show');
      }
    }).done(function(data){
      data.playlists.sort(sortByAttributeNameComparitor)
      renderHandlebarsTemplate('playlists', data);  
      playlists = data;        
      $('.modal').modal('hide');
    });      
  }           

  //Get Plastlist tracks        
  getPlayListTracks = function(uri){
    $.ajax({
      cache: "false",
      dataType: "json",
      url: '/spotify-server/playlist/'+uri.split(':')[4],
      beforeSend: function() {
        $('.modal').modal('show');
      }            
    }).done(function(data){          
      renderHandlebarsTemplate('tracks', data);

      //Load first track
      tracks = data;
      currentTrack = 0;
      loadTrack();
    });          
  }

  renderAlbumArt = function(trackURI){
    $.ajax({
      cache: "false",
      dataType: "json",
      url: '/spotify-server/album-art/'+trackURI        
    }).done(function(data){
      renderHandlebarsTemplate('currentAlbumArt', data.oembed, '#albumArt');
    }); 
  }

  //Play next track
  loadTrack = function() {
    $('.modal').modal('show');

    if(currentTrack+1 > tracks.tracks.length)
      currentTrack = 0;
    else if(currentTrack < 0)
      currentTrack = 0;

    highlighTrackRow(tracks.tracks[currentTrack].trackURI);
    renderHandlebarsTemplate('currentTrack', tracks.tracks[currentTrack], '.currentTrack');
    renderAlbumArt(tracks.tracks[currentTrack].trackURI);          
    $('#audioPlayer').attr('src','/'+tracks.tracks[currentTrack].trackURI+'.mp3');
    $('#audioPlayer').get(0).load();                    
  }

  highlighTrackRow = function(trackURI){
    $('.table .alert-info').attr('class', 'success');
    $('.table tr[id*='+trackURI.split(':')[2]+']').attr('class', 'alert-info');
  }

  playTrack = function(trackURI){
    var trackNumber = $('tr[name="track"]').index($('tr[id*='+trackURI.split(':')[2]+']'));
    currentTrack = trackNumber;
    loadTrack();
  }

  //Render Handlebars Template
  renderHandlebarsTemplate = function(templateId, context, targetId){
    console.log('Rendering handlebars template with id',templateId,'and context',context);
    var template = Handlebars.compile($('#'+templateId).html());    
    var target = targetId || '.content';                
    $(target).html(template(context));
  }   

  //Sort function for playlists
  function sortByAttributeNameComparitor(a,b) {
    if (a.attributes.name < b.attributes.name)
      return -1;
    if (a.attributes.name > b.attributes.name)
      return 1;
    
    return 0;
  }   

  //Handler for login
  $('#login').click(function(){
    $.ajax({
      cache: "false",
      dataType: "json",
      url: '/spotify-server/login/'+$('#username').val()+':'+$('#password').val(),
      beforeSend: function() {
        $('.modal').modal('show');
      }            
    }).done(function(data){  
      if(data.success){
        $.cookie('username', $('#username').val());
        $.cookie('password', $('#password').val());
        $('#nav').show();
        $('.login-wrapper').hide();        
        getPlayLists();        
      }
      else{
        $('#loginMessage').show();
        $('.modal').modal('hide');
      }       
    }); 
  });

  //Handler for play
  $('#audioPlayer').on('canplay', function(){             
    $('#audioPlayer').get(0).play();
    $('.modal').modal('hide');       
  });  

  //Handler for audio player progress
  $('#audioPlayer').on('timeupdate', function(){    
    var value = 0;
    var audioPlayer = $('#audioPlayer').get(0);
    var duration = tracks.tracks[currentTrack].duration/1000;

    var s = (audioPlayer.currentTime % 60).toFixed(0);
    var m = ((audioPlayer.currentTime / 60) % 60).toFixed(0);
    var timePlayed = s < 10 ? m+':0'+s : m+':'+s;


    var sleft = ((duration-audioPlayer.currentTime) % 60).toFixed(0);
    var mleft = (((duration-audioPlayer.currentTime)/60) % 60).toFixed(0);
    sleft = sleft < 10 ? '0'+sleft : sleft;
    mleft = mleft < 10 ? '0'+mleft : mleft;

    var played = mleft+':'+sleft;

    if(audioPlayer.currentTime > 0){
      value = ((100/duration) * audioPlayer.currentTime);
    }
    $('#progress-bar').attr('aria-valuenow', value);
    $('#progress-bar').attr('style', 'width: '+value+'%');
    $('#current-time').text(timePlayed);
    $('#duration').text(played);

  }); 

  //Handler for audio player track ended
  $('#audioPlayer').on('ended', function() {
    currentTrack++;
    loadTrack();      
  });   

  //Handler for Playlist link
  $('#playlists-link').click(function(e){
    e.preventDefault();
    renderHandlebarsTemplate('playlists', playlists);
  });    
  $('.glyphicon-th-list').mouseover(function(){
    $(this).tooltip('show');
  });  

  //Handler for Now playing link
  $('#nowPlaying-link').click(function(e){
    e.preventDefault();
    renderHandlebarsTemplate('tracks', tracks);
    renderHandlebarsTemplate('currentTrack', tracks.tracks[currentTrack], '.currentTrack');
    renderAlbumArt(tracks.tracks[currentTrack].trackURI);   
    highlighTrackRow(tracks.tracks[currentTrack].trackURI);
  });
  $('.glyphicon-play').mouseover(function(){
    $(this).tooltip('show');
  });   

  //Handler for Search link
  $('#search-link').click(function(e){
    e.preventDefault();
    renderHandlebarsTemplate('searchResults', null);
  });

  //Handler for Search
  $('.search').keypress(function(e){
    var self = $(this);

    if(e.which==13){
      $.ajax({
        cache: "false",
        dataType: "json",
        url: '/spotify-server/search/'+self.val(),
        beforeSend: function() {
          $('.modal').modal('show');
        }            
      }).done(function(data){  
        renderHandlebarsTemplate('searchResults', data);
        $('.modal').modal('hide'); 
      });     
    } 
  });  
});  