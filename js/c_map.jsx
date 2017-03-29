/* global m */
/* global google */
/* global appState */
'use strict';

var c = c || {};

/******************************************************************
*
* The map component
* mithril wrapper around google maps
*
******************************************************************/

c.map = {
    controller: function(){

    },
    view: function(ctrl, attrs){
        return <div>
            <div className="map" config={c.map.config(attrs)}></div>
        </div>;
    },

    mapLat: 0,
    mapLng: 0,
    libs: [],
    libMarkers: [],
    /**
    *   c.map config factory. The params in this jsDoc refer to properties of the `ctrl` argument
    *   @param {float} lat - latitude, sets position/new position if not undefined
    *   @param {float} lng - longitude, sets position/new position if not undefined
    *   @param {array} libs - the library array from biblSearch
    *   @param {bool}  centerOnUser - request that the map is centered on the user.
    *                                 This controller sets it to false after done.
    */
    config: function (ctrl) {
        return function (element, isInitialized) {
            if (!isInitialized) {
                var mapOptions = {
                    center: new google.maps.LatLng({
                        lat: ctrl.lat,
                        lng: ctrl.lng
                    }),
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false
                };

                console.log('Creating a new map: ', ctrl.lat, ctrl.lng);
                this.gMap = new google.maps.Map(element, mapOptions);

                // Put a user marker on map
                this.meMarker = new google.maps.Marker({
                    position: { lat: appState.map.userLat, lng: appState.map.userLng },
                    map: this.gMap,
                    icon: appState.map.userMarker
                });
                // Begin tracking user
                this.trackUserPos(this.meMarker);

            } else {
                console.log('redraw map');
                // check if appState lat or lng is different from
                // previous redraw. This lets the user pan around the
                // map and at the same time get a data-flow from appState (model)
                // to map view. (When we change appState lat & lng this pans the map
                // to new center on next redraw)

                if (ctrl.centerOnUser) {
                    console.log('Center on user');
                    appState.map.lat = appState.map.userLat;
                    appState.map.lng = appState.map.userLng;
                    appState.map.requestUserCenter = false;
                    this.mapLat = appState.map.userLat;
                    this.mapLng = appState.map.userLng;
                    this.gMap.panTo({ lat: this.mapLat, lng: this.mapLng });
                } else if (ctrl.lat !== this.mapLat && ctrl.lng !== this.mapLng) {
                    console.log('panTo: ', ctrl.lat, ctrl.lng);
                    this.gMap.panTo({ lat: ctrl.lat, lng: ctrl.lng });
                    this.mapLat = ctrl.lat;
                    this.mapLng = ctrl.lng;
                }

                // Update user pos on every redraw
                this.meMarker.setPosition({ lat: appState.map.userLat, lng: appState.map.userLng });

                // New markers for libraries if we have a new array of markers
                if (ctrl.libs !== this.libs) {
                    console.log('Removing previous library markers');
                    this.libMarkers.forEach(function (marker) {
                        marker.setMap(null);
                    });
                    // New array, also clears referenses to previous markers
                    this.libMarkers = [];
                    console.log('Creating new library markers');
                    // console.log(ctrl.libs);

                    var theMap = this.gMap;
                    ctrl.libs.forEach(function (lib) {
                        var libMarker = new google.maps.Marker({
                            position: { lat: lib.latitude, lng: lib.longitude },
                            map: theMap,
                            icon: appState.map.libMarker
                        });

                        libMarker.info = new google.maps.InfoWindow({
                            content: '<h4>' + lib.name + '</h4>' +
                                     '<a href="' + lib.url + '" target="_blank">' +
                                     lib.url + '</a>'
                        });

                        libMarker.addListener('click', function () {
                            // theMap.panTo(libMarker.getPosition());
                            libMarker.info.open(theMap, libMarker);
                        });

                        libMarker.addListener('dblclick', function () {
                            theMap.panTo(libMarker.getPosition());
                            theMap.setZoom(11);
                        });
                        this.libMarkers.push(libMarker);
                    }.bind(this));

                    this.libs = ctrl.libs;
                }
            }
        }.bind(this);
    },

    /**
    * Ask for the user position
    * uses watchPosition() that updates when user change position
    * m.startComputation() and m.endComputation() can't be used because
    * the redraw will interfare with textinput <-> m.prop coupling
    * @param {objekt} - google.maps.Marker to show position
    */
    trackUserPos: function (meMarker) {

        // Ok, this is hackish...
        var onInit = true;

        var options = {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 4900
        };

        /**
        * The success callback for watchPosition()
        * Update the meMarker on sucess and update appState with the
        * new user position. On app init, request the map centers on user.
        *
        * @param {object}
        *
        * @return void
        **/
        var success = function (pos) {
            var crd = pos.coords;

            console.log('Your current position is:');
            console.log('Latitude:', crd.latitude);
            console.log('Longitude:', crd.longitude);
            console.log('More or less', crd.accuracy, 'meters.');

            appState.map.userLat = crd.latitude;
            appState.map.userLng = crd.longitude;

            meMarker.setPosition({ lat: appState.map.userLat, lng: appState.map.userLng });

            // TODO: Gottamit! Don't know if this is neeeded!
            // On first sucess we need to call m.redraw to put the meMarker
            // in the right position.
            // if (onInit) {
            //     console.log('First user pos.');
            //     onInit = false;
            //     m.redraw();
            // }
        }.bind(this);

        /**
        * Error callback for watchPosition(). Just print to log,
        * a lot of the time we get many succeses and some errors
        * @param
        * @param
        *
        * @return
        **/
        var error = function (err) {
            console.log('User pos ERROR(' + err.code + '): ' + err.message);
        };

        navigator.geolocation.watchPosition(success, error, options);
    }
};
