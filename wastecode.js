tabId = {};
chrome.tabs.query(
{active:true, currentWindow: true}, (tabs) => {
    console.log(tabs)
    tabId = tabs[0].id;
    console.log('got the active tab id.', tabId);
});   


            // const stream = await navigator.mediaDevices.getUserMedia({
            //     video: {
            //       mandatory: {
            //         chromeMediaSource: 'screen',
            //         chromeMediaSourceId: streamId,
            //       },
            //     },
            //     audio: {
            //       mandatory: {
            //         chromeMediaSource: 'desktop',
            //         chromeMediaSourceId: streamId,
            //       },
            //     },
            //   });
            
            //   stream.removeTrack(stream.getVideoTracks()[0]);
            //   console.log(stream.getTracks())
            //   console.log(stream.getTracks()[0]);
            //   console.log(stream.getTracks()[0].getSettings());


chrome.tabCapture.getMediaStreamId({targetTabId:tabId}, (c) => {
        console.log(c)
        console.log("got media stream id");

        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
            audio: {
                mandatory: {
                    chromeMediaSource: 'tab',
                    chromeMediaSourceId: c
                }
            }
        })
        .then((stream) => {
            console.log("caputured")
        });

    });

chrome.desktopCapture.chooseDesktopMedia(['audio'], sender.tab, (streamId, options) => {
    console.log(streamId)
    console.log(options)
    console.log("audio captured");
});

tabId = tabs[0].id
console.log("try to get streamid of tab ", tabId);
chrome.tabCapture.getMediaStreamId({consumerTabId: tabId}, (c) => {
    console.log(c)
    console.log("got media stream id:", c);
    chrome.tabs.sendMessage(tabId, {command: "streamId_messaging", streamId: c, tabId: tabId}, function(response) {
        console.log(response.farewell);
    });
});



console.log(tab === undefined)
console.log(tab.id);console.log("User clicked.")
const { streamId, options } = await new Promise((resolve) => {
    chrome.desktopCapture.chooseDesktopMedia(
      ['tab', 'audio'],
      tab,
      async (streamId, options) => {
        resolve({ streamId, options });
      }
    );
  }).catch((err) => console.error(err));
  console.log(streamId, options);


////////////////// content
console.log("content.js starts");

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
            console.log()
            if (request.command === "streamId_messaging"){
                console.log("get stream id: ", request.streamId);

                // chrome.tabCapture.capture({audio: true, video: false},(c) => {
                //     console.log("captured")
                //     console.log(c)
                // });
                // audioContext = new AudioContext();

                navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: true,
                    audio: {
                        mandatory: {
                            chromeMediaSource: 'tab',
                            chromeMediaSourceId: request.streamId
                        }
                    }
                })
                .then((stream) => {
                    //console.log(stream)
                    //manipulate_stream(stream)

                    audioContext = new AudioContext();
                    stream2audioContext = audioContext.createMediaStreamSource(stream);
                    stream2audioContext.connect(audioContext.destination);
                    
                    // const video = document.querySelector('audio');
                    // video.onloadedmetadata = (e) => {
                    //     video.play();
                    //   };

                    //console.log("caputured")
                });
            }
            sendResponse({farewell: "goodbye"});
        }
    ); 

////////////////////////////