tabId = {};
chrome.tabs.query(
{active:true, currentWindow: true}, (tabs) => {
    console.log(tabs)
    tabId = tabs[0].id;
    console.log('popup.js got the active tab id.', tabId);
});   


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
