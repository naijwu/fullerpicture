const key = launchcodes.key;
const api = `https://customsearch.googleapis.com/customsearch/v1?key=${key}`;
const cx = 'a360ca4e575472d2e';

// elements to edit on the popup

let current_site_name = document.getElementById("current-site-name");
let current_site_lean = document.getElementById("current-site-lean");

let left_alt = document.getElementById("left-alt");
let centre_alt = document.getElementById("centre-alt");
let right_alt = document.getElementById("right-alt");
let left_alt_name = document.getElementById("left-alt-name");
let centre_alt_name = document.getElementById("centre-alt-name");
let right_alt_name = document.getElementById("right-alt-name");

const sortData = (items, origin, spectrum) => {
    // sorts the responses into the different sides, returns object with info on: sides, link, headline (for the popup)

    let relatedLeft = {};
    let relatedRight = {};
    let relatedCentre = {};

    items.forEach((x) => {
        if (!(x.displayLink.includes(origin))) {
            // if it's not from the same place

            // first come first serve -- if a choice fits all (one) necessary criteria: different political biases

            let link = x.displayLink;
            if(link.includes("https://")) {
                if (link.includes("www.", 8)) {
                    link = link.substring(12);
                } else {
                    link = link.substring(8); 
                }
            } else if(link.includes("http://")) {
                if (link.includes("www.", 7)) {
                    link = link.substring(11);
                } else {
                    link = link.substring(7); 
                }
            } else if (link.includes("www.")) {
                link = link.substring(4);
            }
            let formatted_link = link.replace(/\./g, "_");
            let bias = spectrum[formatted_link];

            if (bias >= 3) {
                // right leaning

                // check if filled already
                if (Object.keys(relatedRight).length === 0 && relatedRight.constructor === Object) {
                    // not filled -- fill!
                    relatedRight = x;
                }

            } else if (bias === 2) {
                // centre leaning

                // check if filled already
                if (Object.keys(relatedCentre).length === 0 && relatedCentre.constructor === Object) {
                    // not filled -- fill!
                    relatedCentre = x;
                }

            } else if (bias <= 1) {
                // left leaning

                // check if filled already
                if (Object.keys(relatedLeft).length === 0 && relatedLeft.constructor === Object) {
                    // not filled -- fill!
                    relatedLeft = x;
                }
            }
        }
    })

    
    if (Object.keys(relatedRight).length === 0 && relatedRight.constructor === Object) {
        // not filled -- fill!
        relatedRight = {
            title: "None found.",
        };
    }
    if (Object.keys(relatedCentre).length === 0 && relatedCentre.constructor === Object) {
        // not filled -- fill!
        relatedCentre = {
            title: "None found.",
        };
    }
    if (Object.keys(relatedLeft).length === 0 && relatedLeft.constructor === Object) {
        // not filled -- fill!
        relatedLeft = {
            title: "None found.",
        };
    }

    
    let returnLoad = {
        left: {
            title: relatedLeft.title,
            agency: relatedLeft.displayLink,
            link: relatedLeft.link,
        },
        centre: {
            title: relatedCentre.title,
            agency: relatedCentre.displayLink,
            link: relatedCentre.link,
        },
        right: {
            title: relatedRight.title,
            agency: relatedRight.displayLink,
            link: relatedRight.link,
        },
    };

    return returnLoad;
}


// sending message to content.js to load all the data
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getPageInfo"}, function(data) {
        if(typeof data == "undefined") {
            // bad
            if(chrome.runtime.lastError) {
                // no idea what this is LOL but shoutout to my homies at stackoverflow
            }
        } else {
            current_site_name.textContent = data.agency;
            current_site_lean.textContent = data.bias;

            // omitting common words from description to get the keywords
            let query = data.description;  // TODO: APPEND the MONTH + YEAR of the ARTICLE
            console.log(query);
            query = query.replace(/ the /g, " ");
            query = query.replace(/ be /g, " ");
            query = query.replace(/ to /g, " ");
            query = query.replace(/ of /g, " ");
            query = query.replace(/ a /g, " ");
            query = query.replace(/ and /g, " ");
            query = query.replace(/ in /g, " ");
            console.log(query);

            var popupInfo = {};

            axios
            .get(`${api}&cx=${cx}&q=${query}`) 
            .then((res) => {
                popupInfo = sortData(res.data.items, data.origin, data.reference);
                console.log(res);

                left_alt.textContent = popupInfo.left.agency;
                centre_alt.textContent = popupInfo.centre.agency;
                right_alt.textContent = popupInfo.right.agency;
    
                left_alt.href = popupInfo.left.link;
                centre_alt.href = popupInfo.centre.link;
                right_alt.href = popupInfo.right.link;
    
                left_alt_name.textContent = popupInfo.left.title;
                centre_alt_name.textContent = popupInfo.centre.title;
                right_alt_name.textContent = popupInfo.right.title;
            });

        }
    });
});


window.addEventListener('click',function(e){
    if(e.target.href!==undefined){
        chrome.tabs.create({url:e.target.href})
    }
})