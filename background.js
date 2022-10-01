chrome.action.onClicked.addListener(function(tab) {console.log(tab);console.log("User clicked.")});

chrome.runtime.onInstalled.addListener(() => {
    
    console.log("background.js starts.")
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
            if (request.greeting === "hello")
                sendResponse({farewell: "goodbye"});
            

            // chrome.desktopCapture.chooseDesktopMedia(['audio'], sender.tab, (streamId, options) => {
            //     console.log(streamId)
            //     console.log(options)
            //     console.log("audio captured");
            // });
        }
    ); 


    chrome.runtime.onMessage.addListener(
        async function(request, sender, sendResponse) {
            console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
            if (request.command === "streamId_messaging"){
                console.log("get stream id: ", request.streamId, "from", request.tabId);

            }
            
            sendResponse({farewell: "goodbye"});
            // chrome.desktopCapture.chooseDesktopMedia(['tab','audio','window'], sender.tab, (streamId, options) => {
            //     console.log(streamId)
            //     console.log(options)
            //     console.log("audio captured");
            // });

            const { streamId, options } = await new Promise((resolve) => {
                chrome.desktopCapture.chooseDesktopMedia(
                  ['tab', 'audio'],
                  sender.tab,
                  async (streamId, options) => {
                    resolve({ streamId, options });
                  }
                );
              }).catch((err) => console.error(err));
              console.log(streamId, options);
        }
    ); 
});
