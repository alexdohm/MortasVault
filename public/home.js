$(document).ready(function(){
  var player = SC.Widget($('iframe.sc-widget')[0]);
  var pOffset = $('.player').offset();
  var pWidth = $('.player').width();
  var scrub;
  var isDragging = false;
  
  player.bind(SC.Widget.Events.READY, function() {
    setInfo();
    player.pause(); //for chrome's audio playing rules
  });
  
  player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
    $('.position').css('width', ( e.relativePosition*100)+"%"); 
  });

  //sets pause button back to play button when sound finishes
  player.bind(SC.Widget.Events.FINISH, function(e) {
    $('.playPause').find('i').toggleClass('fa-play fa-pause');
  });

  // Exploring within track - dragging or clicking within track
    $('.player')
      .on('mousedown', function(e){
        scrub = (e.pageX - pOffset.left);
        isDragging = true;
      })
      .on('mousemove', function(e){
        if (!((e.pageX - pOffset.left) === scrub) && isDragging === true) {
          scrub = (e.pageX - pOffset.left);
          $('.position').css('width',scrub+"px");
          var seek = player.duration*(scrub/pWidth);
          player.seekTo(seek);
        }
      })
      .on('mouseup', function(e){
        $('.position').css('width',scrub+"px");
        var seek = player.duration*(scrub/pWidth); 
        player.seekTo(seek);
        isDragging = false;
      });

  // Pause and play player, change icon when done
  $('.playPause')
    .click(function(){
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

      // need to modify file type of waveform to use
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

  $("#volumeSlider").slider({
    min: 0,
    max: 100,
    value: 50,
    range: "min",
    slide: function(event, ui) {
      player.setVolume(ui.value);
    }
  });
  
});