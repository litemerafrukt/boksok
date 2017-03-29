/* global m */
/* global DOMParser */
'use strict';

/**
* Module for the libris search object
**/
window.librisSearch = (function () {
    var records = [];

    /**
    * Main search function
    *
    * Fetches and then replaces the records array with the result
    *
    * @param {string} or {number} - the isbn to search for
    * @return {number} - the total number of records from libris
    *                       -1: query error,
    *                        0: nothing found
    *                      >=1: succesfull search
    **/

    var fetchIsbn = function (isbn) {
        // reset records list
        records = [];

        return m.request({
            method: 'GET',
            url: 'resources/demo-libris/get-book.php?query=isbn:' + isbn + '&holdings=true&format=mods',
            // url: 'https://libris.kb.se/xsearch?query=isbn:' + isbn + '&holdings=true&format=mods',
            deserialize: function(data) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data, 'application/xml');
                return xmlDoc;
            }
        })
        .then(function (xml) {
            // Parse xml responce and build the records array

            var i, j, titleInfo, nonSort, title, subTitle, name, namePart, note, nrOfRecords, bookRecord, mods, locals;

            // if error, exit
            if (xml.getElementsByTagName('xsearch')[0].hasAttribute('error')) {
                return -1;
            }

            // How many records
            nrOfRecords = xml.getElementsByTagName('xsearch')[0].getAttribute('records');
            // if records === 0 then libris didn't find anything
            if (nrOfRecords  === 0) {
                return 0;
            }

            /*************************************
            * Each record is wrapped in <mods>
            * Each record has a <titleInfo>
            *  and always a <title>
            *  and sometimes a <subTitle>
            *  and a preciding <nonSort>
            * The author can be found under <namePart>
            *  if not check
            *   <note type="statement of responsibility">name</note>
            * Library siegels are under <physicalLocation>
            **************************************/
            mods = xml.getElementsByTagName('mods');
            // Loop records and collect data from xml
            for (i = 0; i < mods.length; i++) {
                // define it here for reset, safeguarding and clearer code
                bookRecord = {
                    title: '',
                    shortTitle: '',
                    author: '',
                    libSigels: []
                };

                // Get title
                titleInfo = mods[i].getElementsByTagName('titleInfo');
                if (titleInfo.length > 0) {
                    titleInfo = titleInfo[0];
                    // Check for nonSort
                    nonSort = titleInfo.getElementsByTagName('nonSort');
                    if (nonSort.length > 0) {
                        bookRecord.title = nonSort[0].textContent;
                    }
                    title = titleInfo.getElementsByTagName('title');
                    if (title.length > 0) {
                        bookRecord.title += title[0].textContent;
                        bookRecord.shortTitle += title[0].textContent;
                    } else {
                        bookRecord.title = 'Ingen titel';
                    }
                    // Check for subtitle
                    subTitle = titleInfo.getElementsByTagName('subTitle');
                    if (subTitle.length > 0) {
                        bookRecord.title += ' : ' + subTitle[0].textContent;
                    }
                }
                // Get author
                // First check namePart and, if not there, check note
                name = mods[i].getElementsByTagName('name');
                note = mods[i].getElementsByTagName('note');
                if (name.length > 0) {
                    namePart = name[0].getElementsByTagName('namePart');
                    if (namePart.length > 0) {
                        bookRecord.author = namePart[0].textContent;
                    }
                } else if (note.length > 0) {
                    if (note[0].hasAttribute('type') && note[0].getAttribute('type') === 'statement of responsibility') {
                        bookRecord.author = note[0].textContent;
                    }
                } else {
                    bookRecord.author = 'Ingen författare hittad';
                }
                // Get library siegels
                locals = mods[i].getElementsByTagName('physicalLocation');
                for (j = 0; j < locals.length; j++) {
                    bookRecord.libSigels.push(locals[j].textContent);
                }

                records.push(bookRecord);
            }

            console.log(records);
            return records.length;
        });
    };

    /**
    * Get a record from the records array
    *
    * @param {integer} - record index
    *
    * @return {object} - the record or empty object
    **/
    var getRecord = function (index) {
        return records[index] || {};
    };

    /**
    * Get all records
    *
    * @param none
    *
    * @return {array} - all records for last search
    **/
    var getRecords = function () {
        return records;
    };

    /**
    * Get all the librarie siegels for record
    *
    * @param {integer} - index of record
    *
    * @return {array} - the siegels or empty
    **/
    var getSigels = function (index) {
        return records[index].libSigels || [];
    };

    /**
    * Number of records
    *
    * @param none
    *
    * @return {integer} - number of records
    **/
    var nrOfRecords = function () {
        return records.length;
    };

    return {
        nrOfRecords: nrOfRecords,
        getRecord: getRecord,
        getRecords: getRecords,
        getSigels: getSigels,
        fetchIsbn: fetchIsbn
    };
})();
