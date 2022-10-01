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
