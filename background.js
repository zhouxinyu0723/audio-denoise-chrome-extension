chrome.action.onClicked.addListener(async function(tab) {
    console.warn("chrome.action.onClicked should not be triggerred. You should not see this.")
});

chrome.runtime.onInstalled.addListener(() => {
    
    console.log("background.js starts.")
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
            if (request.greeting === "hello")
                sendResponse({farewell: "goodbye"});
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

            // get active tab id
            const tab = await new Promise((resolve) => {
                chrome.tabs.query(
                    {active:true, currentWindow: true}, (tabs) => {
                        resolve(tabs[0])
                    });   
                });
            console.log('got the active tab id: ', tab);

            // get stream id
            const { streamId, options } = await new Promise((resolve) => {
                chrome.desktopCapture.chooseDesktopMedia(
                  ['tab', 'audio'],
                  tab,
                  async (streamId, options) => {
                    resolve({ streamId, options });
                  }
                );
            }).catch((err) => console.error(err));
            console.log('got stream id: ', streamId, ' and option: ', options);
            
            // send stream id back to context
            chrome.tabs.sendMessage(tab.id, {command: "background2content_streamId", streamId: streamId}, function(response) {
                console.log(response.farewell);
            });

            sendResponse({farewell: "goodbye"});



        }
    ); 
});
