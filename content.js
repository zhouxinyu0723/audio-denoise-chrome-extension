console.log("content.js starts");

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log(sender.tab ?
//                     "from a content script:" + sender.tab.url :
//                     "from the extension");
//         if (request.greeting === "hello")
//         sendResponse({farewell: "goodbye"});


//     });

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
                    console.log(stream)
                    console.log("caputured")
                });


            }
            
            sendResponse({farewell: "goodbye"});

        }
    ); 

// function getUserMediaHttp() {

//     chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log(sender.tab ?
//                     "from a content script:" + sender.tab.url :
//                     "from the extension");
//         console.log()
//         if (request.command === "streamId_messaging"){
//             console.log("get stream id: ", request.streamId);
            


//             // chrome.tabCapture.capture({audio: true, video: false},(c) => {
//             //     console.log("captured")
//             //     console.log(c)
//             // });

//                 navigator.mediaDevices.getUserMedia({
//                     video: false,
//                     audio: true,
//                     audio: {
//                         mandatory: {
//                             chromeMediaSource: 'tab',
//                             chromeMediaSourceId: request.streamId
//                         }
//                     }
//                 })
//                 .then((stream) => {
//                     console.log("caputured")
//                 });



//         }
        
//         sendResponse({farewell: "goodbye"});

//     });
// }
// var script = document.createElement('script');
// (document.head || document.body || document.documentElement).appendChild(script).text = getUserMediaHttp.toString() + ';';
// script.remove();