var content = document.getElementById('video_player');
var videoContainer = document.getElementById('video_container');
var adContainer = document.getElementById('adContainer');

OO.Pulse.setPulseHost('http://pulse-demo.videoplaza.tv');

var contentMetadata = {
  tags: [ 'cat_preroll', 'cat_midroll' ,'cat_postroll']
};

var requestSettings = {
  linearPlaybackPositions: [ 10 ]
 // insertionPointFilter: ['ON_CONTENT_END']
};

var session = OO.Pulse.createSession(contentMetadata, requestSettings);

var adPlayer = OO.Pulse.createAdPlayer({ adContainerElement: adContainer });

var adPlayerListener = {
  // Here, the Ad Player is telling the integration to start (or resume) playing the main content
  startContentPlayback: function() {
    content.play();
    videoContainer.style.display = 'block'; // or any other means to make the content player visible
  },

  // The Ad Player is telling the integration to pause the main content, so linear ads can be played
  pauseContentPlayback: function() {
    content.pause();
    videoContainer.style.display = 'none'; // or any other means to make the content player invisible
  },

  // If you tell the Ad Player to perform some action which is unexpected due to
  // the current state, this function is called to let the integration know
  illegalOperationOccurred: function(message) {
    console.warn('Illegal operation: ', message);
  },

  // The content finished playback, and if any post-rolls were served, they also finished
  sessionEnded: function() {
    videoContainer.style.display = 'block';
  },

  // When the viewer clicks an ad, this function is called to let the integration know, and provide
  // it with the information needed to open the clickthrough URL
  openClickThrough: function(url) {
    window.open(url);

    // Tell the Ad Player the clickthrough URL was opened, so the associated VAST event can be tracked
    adPlayer.adClickThroughOpened();
  }
};

var initialPlay = true;

function onPlay() {
  if(initialPlay) {
    initialPlay = false;
    content.pause(); // Pause the content so we can play pre-rolls
    adPlayer.startSession(session, adPlayerListener); // Start the Ad Player event flow
  } else {
    // When the content is resumed, call contentStarted
    adPlayer.startSession(session, adPlayerListener);
    adPlayer.contentStarted();
  }
}

function onTimeUpdate() {
  adPlayer.contentPositionChanged(content.currentTime);
}

function onPause() {
  // Let the Ad Player know the content is paused
  adPlayer.contentPaused();
}

function onEnded() {
  adPlayer.contentFinished();
}

content.addEventListener('play', onPlay);
content.addEventListener('pause', onPause);
content.addEventListener('timeupdate', onTimeUpdate);
content.addEventListener('ended', onEnded);
