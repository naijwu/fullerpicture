// script runs when a page is loaded




// spectrum obtained from https://allsides.com/media-bias/media-bias-ratings
// the object's keys are named after an altered base URL for their websites
const spectrum = {
    // left
    alternet_org: 0,
    buzzfeednews_com: 0,
    cnn_com: 0,
    democracynow_org: 0,
    thedailybeast_com: 0,
    huffpost_com: 0,
    theintercept_com: 0,
    jacobinmag_com: 0,
    motherjones_com: 0,
    msnbc_com: 0,
    newsweek_com: 0,
    newyorker_com: 0,
    nytimes_com: 0,
    thenation_com: 0,
    slate_com: 0,
    vox_com: 0,

    // lean left
    abcnews_go_com: 1,
    ap_org: 1,
    theatlantic_com: 1,
    bloomberg_com: 1,
    cbsnews_com: 1,
    economist_com: 1,
    theguardian_com: 1,
    nbcnews_com: 1,
    npr_org: 1,
    politico_com: 1,
    propublica_org: 1,
    time_com: 1,
    washingtonpost_com: 1,
    ca_news_yahoo_com: 1,
    news_yahoo_com: 1,

    // centre
    axios_com: 2,
    bbc_com: 2,
    bbc_co_uk: 2,
    csmonitor_com: 2,
    ca_reuters_com: 2,
    reuters_com: 2,
    realclearpolitics_com: 2,
    thehill_com: 2,
    usatoday_com: 2,
    wsj_com: 2,

    // lean right
    theamericanconservative_com: 3,
    thedispatch_com: 3,
    foxnews_com: 3,
    marketwatch_com: 3,
    newsmax_com: 3,
    nypost_com: 3,
    thepostmillennial_com: 3,
    reason_com: 3,
    washingtonexaminer_com: 3,
    washingtontimes_com: 3,

    // right
    theepochtimes_com: 4,
    spectator_org: 4,
    breitbart_com: 4,
    theblaze_com: 4,
    cbn_com: 4,
    dailycaller_com: 4,
    dailymail_co_uk: 4,
    dailywire_com: 4,
    thefederalist_com: 4,
    nationalreview_com: 4,
    oann_com: 4,
};

// to used to convert bias no. to english
const KISS = {
    0: 'Left',
    1: 'Lean Left',
    2: 'Centre',
    3: 'Lean Right',
    4: 'Right',
}

var origin = window.location.origin;
if(origin.includes("https://")) {
    if (origin.includes("www.", 8)) {
        origin = origin.substring(12);
    } else {
        origin = origin.substring(8); 
    }
} else if(origin.includes("http://")) {
    if (origin.includes("www.", 7)) {
        origin = origin.substring(11);
    } else {
        origin = origin.substring(7); 
    }
} else if (origin.includes("www.")) {
    origin = origin.substring(4);
}
var formatted_origin = origin.replace(/\./g, "_");

var bias = spectrum[formatted_origin];

var newsAgency = $('meta[property="og:site_name"]').attr('content');

var articleTitle = $('meta[property="og:title"]').attr('content');
var articleDescription = $('meta[name=description]').attr('content');

var articleMonth = ''; // TODO: FIND THESE
var articleYear = '';


console.log(' title: ' + articleTitle + ',\n\n desc: ' + articleDescription + ',\n\n agency: ' + newsAgency + ',\n\n base url: ' + origin + ',\n\n bias no.: ' + bias);


let amazonPrime = {
    title: articleTitle,
    description: articleDescription,
    agency: newsAgency,
    origin: origin,
    bias: KISS[bias],
    reference: spectrum,
    month: articleMonth, 
    year: articleYear,
};


// listening if a popup is opened at a tab
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "getPageInfo":
                sendResponse(amazonPrime);
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);
