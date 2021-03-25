INVIDI-Integration with native web player using HTML5 Pulse SDK

This project is created for the invidi task 1.

This project is created with HTML5 native web player integrated with HTML5 Pulse SDK to impletement pre-roll, mid-roll and post-roll ads when playing the video content. 


How to run the project
1. Run npm install
2. Run npm start


The code is largely based on the tutorial code from Invidi HTML5 tutorial, with some nessasary changes and tunes. Most of the part goes quite smooth, but the post roll ad is not working from the tutorial. I spent quite a good load of time checking documents, investigating and debugging. The cause is highly likely due the  behaviour of native video element. when a video is finished, it first triggers a pause event, then trigger a end event. As the pause invent will trigger adplayer to set its internal status to pause, however the following end event will trigger adplayer to play post roll ad only after checking its internal status is not pause, otherwise a warning(exception) is issued. So the fix is simply add an adPlayer.contentStarted() before calling adPlayer.contentFinished() in the video end event handler.