$(document).ready(function(){
  
  // var player = SC.Widget($('iframe.sc-widget')[0]);
  var player = SC.Widget($('iframe.sc-widget')[0]);
  var pOffset = $('.player').offset();
  var pWidth = $('.player').width();
  var scrub;
  
  player.bind(SC.Widget.Events.READY, function() {
    setInfo();
    // player.pause();
  }); //Set info on load
  
  player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
    if( e.relativePosition < 0.003 ) { setInfo(); } //beginning of current playback
    //Event listener when track is playing
    $('.position').css('width', ( e.relativePosition*100)+"%"); 
  });

  player.bind(SC.Widget.Events.FINISH, function(e) { //sets pause button back to play button when sound finishes
    $('.playPause').find('i').toggleClass('fa-play fa-pause');
  });
  
   $('.player').mousemove(function(e){ //Get position of mouse for scrubbing
    scrub = (e.pageX-pOffset.left);
  });

  $('.player').click(function(){ //Use the position to seek when clicked
    $('.position').css('width',scrub+"px");
    var seek = player.duration*(scrub/pWidth); 
    
    //Seeking to the start would be a previous?
    if ( seek < player.duration * .05 ) {
      player.prev();
    } else if ( seek > player.duration * .99 ) {
      player.next();
    } else {      
      player.seekTo(seek);
    }
    
  });

  $('.playPause').click(function(){
    var playPauseChangeButton=$(this).find('i').hasClass('fa-play');

    $('.playPause').find('i').removeClass('fa-pause');
    $('.playPause').find('i').addClass('fa-play');

    if(playPauseChangeButton) {
      player.play();
      $(this).find('i').toggleClass('fa-play fa-pause');
    } else {
      player.pause();
    }
  });
  
  function setInfo() {
    player.getCurrentSound(function(song) {
      // Soundcloud just borked this api endpoint, hence this hack :/
      var waveformPng =
          song.waveform_url
              .replace('json', 'png')
              .replace('wis', 'w1');
      var artworkUrl = song.artwork_url || '';
      
      // console.log(song);
      
      $('.waveform').css('background-image', "url('" + waveformPng + "')");    
      $('.player').css('background-image', "url('" + artworkUrl.replace('-large', '-t500x500') + "')");
      
      var info = song.title;
      $('.info').html(info);
      
      player.current = song;
    });
    
    player.getDuration(function(value){
      player.duration = value;
    });

    player.isPaused(function(bool){
      player.getPaused = bool;
    });
  }   
  
});