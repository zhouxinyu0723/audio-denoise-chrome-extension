window.AudioContext = window.AudioContext || window.webkitAudioContext;
chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        console.log()
        if (request.command === "background2content_streamId"){
            console.log("background2content streamId success: ", request.streamId);


            streamId = request.streamId;
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                  mandatory: {
                    chromeMediaSource: 'screen',
                    chromeMediaSourceId: streamId,
                  },
                },
                audio: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId,
                  },
                },
              });
              stream.removeTrack(stream.getVideoTracks()[0]);
              console.log(stream.getTracks())
              console.log(stream.getTracks()[0]);
              console.log(stream.getTracks()[0].getSettings());
              //
              audioContext = new AudioContext({
                latencyHint: 'interactive',
                sampleRate: 48000,
                });
              audioContext.latencyHint = "playback";
              stream2audioContext = audioContext.createMediaStreamSource(stream);
              gainNode = audioContext.createGain();
              gainNode.gain.setValueAtTime(
                -1,
                audioContext.currentTime
              );
              stream2audioContext.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
        }
        sendResponse({farewell: "goodbye"});
    }
); 