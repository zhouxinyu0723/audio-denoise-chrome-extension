


document.addEventListener(
	"DOMContentLoaded", async function() {
        console.log('popup.js starts');

        document.getElementById("denoise_switch").addEventListener('change', function(e) {
            console.log('click');
            console.log(e.target.checked);
            if (e.target.checked){
                chrome.runtime.sendMessage({command: "testing", greeting: "hello"}, function(response) {
                        console.log(response.farewell);
                    });
                
                  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {command: "testing", greeting: "hello"}, function(response) {
                        console.log(response.farewell);
                        });
                  });
            }

            if (!e.target.checked){
                chrome.runtime.sendMessage({command: "testing", greeting: "hello"}, function(response) {
                    console.log(response.farewell);
                });
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {command: "testing", greeting: "hello"}, function(response) {
                        console.log(response.farewell);
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
                });
            }
        });
    });

