document.addEventListener(
	"DOMContentLoaded", async function() {
        console.log('popup.js starts');
            
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "check_activated", value: 0}, function(response) {
            console.log(response.value==1)
            if (response.value==="not_defined"){
            // denoise is not activated
                ;
            }else{
            // denoise is already activated
                if(response.value==1){
                    document.getElementById("activated").checked = true;
                    document.getElementById("denoise_scale").disabled=false;
                    document.getElementById("noise_upper_bound").disabled=false;
                }
            }
            });
        });

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "check_denoise_scale", value: 0}, function(response) {
                if (response.value==="not_defined"){
                // denoise is not activated
                    document.getElementById("denoise_scale_result").innerText=document.getElementById("denoise_scale").value;
                }else{
                // denoise is already activated
                    console.log("denoise_scale is "+ response.value)
                    document.getElementById("denoise_scale").value = response.value;
                    document.getElementById("denoise_scale_result").innerText=response.value.toFixed(2);
                }
            });
        });

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "check_noise_upper_bound", value: 0}, function(response) {
                if (response.value==="not_defined"){
                // denoise is not activated
                document.getElementById("noise_upper_bound_result").innerText=document.getElementById("noise_upper_bound").value+"%";
                }else{
                // denoise is already activated
                    console.log("noise_upper_bound is "+ response.value * 100 + "%")
                    document.getElementById("noise_upper_bound").value = response.value * 100;
                    document.getElementById("noise_upper_bound_result").innerText=(response.value*100).toFixed(2)+"%";
                }
            });
        });

        document.getElementById("activated").addEventListener('change', function(e) {
            console.log('click');
            console.log(e.target.checked);
            if (e.target.checked){
                  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {command: "activating", value: "0"}, function(response) {
                        if(response.value==="success"){
                            document.getElementById("denoise_scale").disabled=false;
                            document.getElementById("noise_upper_bound").disabled=false;
                            // t=setInterval(runFunction,100);
                            }
                        });
                  });
            }

            if (!e.target.checked){
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {command: "deactivating", value: "0"}, function(response) {
                        if(response.value==="success"){
                        document.getElementById("denoise_scale").disabled=true;
                        document.getElementById("noise_upper_bound").disabled=true;
                        // clearInterval(t);
                        }
                    });
                });
            }
        });

        document.getElementById("denoise_scale").addEventListener('change', function(e) {
            document.getElementById("denoise_scale_result").innerText=document.getElementById("denoise_scale").value;
            console.log("denoise_scale changed to" + document.getElementById("denoise_scale").value)
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {command: "change_denoise_scale", value: document.getElementById("denoise_scale").value}, function(response) {
                console.log(response.value);
                });
            });
        });

        document.getElementById("noise_upper_bound").addEventListener('change', function(e) {
            document.getElementById("noise_upper_bound_result").innerText=document.getElementById("noise_upper_bound").value+"%";
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

