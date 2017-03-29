/* global m */
'use strict';

window.biblSearch = (function () {
    var libraries = [];

    /**
    * Main search function
    *
    * Fetches and then replaces the library array with the result
    * If a library doesn't have any coordinates the function dose
    * another ajax request/search on google api to get the coordinates
    * for the library city.
    *
    * @param {array} - all the sigels to search for
    * @return {array} - the library array
    **/
    var fetchLibraries = function (sigels) {
        // clear libs if not done allready
        libraries = [];
        // join the siegels
        sigels = sigels.join(',');
        return m.request({
            method: 'GET',
            url: 'resources/demo-bibliotek/get-biblio.php?sigel=' + sigels
            // dataType: 'jsonp',
            // url: 'https://bibdb.libris.kb.se/api/lib?sigel=' + sigels
        }).then(function (data) {
            // Copy and do things with the answer
            // console.log(data);
            libraries = data.libraries || [];
            if (!(data.libraries)) {
                libraries = [];
            } else {
                // first filter the answer, if alive === true then keep
                libraries = data.libraries.filter(function (lib) {
                    return lib.alive === true;
                }).map(function (lib) {
                    // console.log(lib);
                    return {
                        name: lib.name,
                        url: lib.url,
                        latitude: Number(lib.latitude),
                        longitude: Number(lib.longitude),
                        address: lib.address
                    };
                });
            }

            // loop libraries array, check if lat or lng is missing
            // if missing, ask google for it based on adress.city from data.libraries
            // this is another m.request with another promise. Should be ok to _not_ wait
            // for the subsequent requests, just make them while user is fiddleing with other
            // stuff.
            libraries.forEach(function (lib) {
                var city = '';
                if (lib.latitude  === null ||
                    lib.longitude === null ||
                    lib.latitude  === 0    ||
                    lib.longitude === 0)
                {
                    console.log('Library with no coords:', lib);
                    if (lib.address) {
                        console.log('Looking for city...');
                        // fetch first city from address array
                        for (var i = 0; i < lib.address.length; i++) {
                            if (lib.address[i].city && lib.address[i].city !== '') {
                                city = lib.address[i].city;
                                console.log('Library:', lib.name, 'is located in', city);
                                break;
                            }
                        }
                    }
                    if (city !== '') {
                        m.request({
                            method: 'GET',
                            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city
                        }).then(function (data) {
                            if (!(data.results) ||
                                !(data.results[0].geometry) ||
                                !(data.results[0].geometry.location))
                            {
                                console.log('No location found for: ', lib.name);
                                return;
                            } else {
                                lib.latitude = data.results[0].geometry.location.lat;
                                lib.longitude = data.results[0].geometry.location.lng;
                                console.log('Location googled for: ', lib.name);
                                console.log('...lat: ', lib.latitude);
                                console.log('...lng: ', lib.longitude);
                            }
                        });
                    }
                }
            });

            return libraries;
        });
    };

    /**
    * Since the biblio search waits for the libris search to
    * finish we might need a way to reset the list.
    *
    * @param none
    * @return none
    **/
    var clearLibraries = function () {
        libraries = [];
    };

    /**
    * Get a library from the library list
    *
    * @param {int} - index i library list
    * @return {obj} - the library
    **/
    var getLibrary = function (index) {
        return libraries[index] || {};
    };

    /**
    * Get the library list
    *
    * @param none
    * @return {array} - the libraries
    **/
    var getLibraries = function () {
        return libraries || [];
    };

    /**
    * Get number of libraries
    *
    * @param none
    * @return {int} number of libraries in this objects array
    **/
    var nrOfLibraries = function () {
        return libraries.length;
    };

    return {
        fetchLibraries: fetchLibraries,
        clearLibraries: clearLibraries,
        getLibrary: getLibrary,
        getLibraries: getLibraries,
        nrOfLibraries: nrOfLibraries
    };
})();
