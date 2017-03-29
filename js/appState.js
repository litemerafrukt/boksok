/* global google */
/* global localStorage */
'use strict';

/****************************
* App state object
****************************/
/******************************************************************
* App state object
* Use to comunicate mainly ui-state between components.
******************************************************************/
var appState = appState || {};
/****************************
* Selected Book Record
* init to first record
* change this when user changes
* selected book
****************************/
appState.sbr = 0;
/****************************
* Map state
****************************/
// Set a new center for map by setting new lat & lng
// Center map on user at startup
appState.map = {
    lat: 55.6,
    lng: 13.0,
    userLat: 56,
    userLng: 14,
    userMarker: {
        url: 'img/usr.png',
        anchor: new google.maps.Point(16, 16) // Anchor in center of icon
    },
    libMarker: {
        url: 'img/lib.png',
        anchor: new google.maps.Point(16, 16) // Anchor in center of icon
    },
    requestUserCenter: true
};

/****************************
* History, save titles and
* isbn
****************************/
appState.history = (function () {
    var historyList;
    // Load history from localStorage
    if (localStorage.length > 0 && localStorage.getItem('titleIsbnHistory')) {
        historyList = JSON.parse(localStorage.getItem('titleIsbnHistory'));
        console.log('Loaded history:', historyList);
    } else {
        historyList = [];
    }

    /**
    * Add to the history and localStorage. Max 10 historical searches
    * This is a dumb history, if you search the same book again and
    * again it adds the same book again and again.
    *
    * @param {string} - the book title
    * @param {string/number} - the book isbn
    *
    * @return void
    **/
    var add = function (title, isbn) {
        historyList.unshift({
            title: title,
            isbn: isbn
        });
        localStorage.setItem('titleIsbnHistory', JSON.stringify(historyList));
        console.log('Added:', title, 'to history.');
        // Max 10 history objects
        if (historyList.length > 9) {
            historyList = historyList.slice(0, 10);
            localStorage.setItem('titleIsbnHistory', JSON.stringify(historyList));
        }
    };

    /**
    * Get the historyList
    *
    * @param none
    *
    * @return {array} - the history
    **/
    var getHistory = function () {
        return historyList || [];
    };

    return {
        add: add,
        getHistory: getHistory
    };
})();
