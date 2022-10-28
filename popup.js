document.addEventListener(
	"DOMContentLoaded", async function() {
        console.log('popup.js starts');
            
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "check_activated", value: 0}, function(response) {
            console.log(response.value? "activated" : "not_activated");
            document.getElementById("activated").checked = response.value;
            if (response.value){
                // t=setInterval(runFunction,100);
            }
            });
        });

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "check_denoise_scale", value: 0}, function(response) {
                console.log("denoise_scale is "+ response.value)
                document.getElementById("denoise_scale").value = response.value;
            });
        });

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "check_noise_upper_bound", value: 0}, function(response) {
                console.log("noise_upper_bound is "+ response.value * 100 + "%")
                document.getElementById("noise_upper_bound").value = response.value * 100;
            });
        });

        document.getElementById("activated").addEventListener('change', function(e) {
            console.log('click');
            console.log(e.target.checked);
            if (e.target.checked){
                  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {command: "activating", value: "0"}, function(response) {
                        console.log(response.farewell);
                        // t=setInterval(runFunction,100);
                        });
                  });
            }

            if (!e.target.checked){
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {command: "deactivating", value: "0"}, function(response) {
                        console.log(response.farewell);
                        // clearInterval(t);
                    });
                });
            }
        });

        document.getElementById("denoise_scale").addEventListener('change', function(e) {
            console.log("denoise_scale changed to" + document.getElementById("denoise_scale").value)
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {command: "change_denoise_scale", value: document.getElementById("denoise_scale").value}, function(response) {
                console.log(response.value);
                });
            });
        });

        document.getElementById("noise_upper_bound").addEventListener('change', function(e) {
            console.log("noise_upper_bound changed to" + document.getElementById("noise_upper_bound").value/100)
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {command: "change_noise_upper_bound", value: document.getElementById("noise_upper_bound").value/100}, function(response) {
                console.log(response.value);
                });
            });
        });

        

        // function runFunction(){
        //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //         chrome.tabs.sendMessage(tabs[0].id, {command: "check_canceled_power", value: 0}, function(response) {
        //         document.getElementById("canceled_power_left").value = 100*response.value_l;
        //         document.getElementById("canceled_power_right").value = 100*response.value_r;
        //         });
        //     });
        // }

    });

