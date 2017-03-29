/* global biblSearch */
/* global appState */
/* global helpers */
/* global Modal */
/* global m */
'use strict';

var c = c || {};

/******************************************************************
* Local helper
******************************************************************/
/**
* Just a wrapper for getDistance
* Uses appState for user pos
*
* @param {object} - a library from biblSearch
*
* @return distance in meters
**/
var getDistanceToLib = function (lib) {
    return helpers.getDistance({
        lat: appState.map.userLat,
        lng: appState.map.userLng
    }, {
        lat: lib.latitude,
        lng: lib.longitude
    });
};


/******************************************************************
*
* The library list component. A button on map. On click show
* modal with list of libraries sorted on distance from user.
* Click lib to request map center on lib.
*
******************************************************************/

c.libResult = {
    libModal: new Modal,
    controller: function () {
        /**
        * Get the map to center on chosen lib by setting
        * new appState.map lat & lng.
        *
        * @param {number} - index of the library
        *
        * @return none
        **/
        var centerMapOnLib = function (index) {
            var lib = biblSearch.getLibrary(index);
            // check that lib has latitude, no nordic lib has lat = 0
            if (lib.latitude !== 0) {
                appState.map.lat = lib.latitude;
                appState.map.lng = lib.longitude;
            } else {
                alert('Det finns inga koordinater för valt bibliotek.');
            }
        };
        return { selectLib: centerMapOnLib };
    },

    view: function (ctrl) {
        var theModal = this.libModal;
        return <div>
            <button className="btn btn-default btn-fab btn-fab-mini"
                onclick={theModal.show.bind(theModal)}>
                <i class="material-icons">account_balance</i>
            </button>
            {
                theModal.view({
                    class: 'rootClass',
                    modalSizeClass: 'modal-lg',
                    header: function () {
                        return <h4>Bibliotek</h4>;
                    },
                    body: function () {
                        var selectLibHideModal = function (index) {
                            console.log('Selected lib index: ', index);
                            ctrl.selectLib(index);
                            theModal.hide();
                        };
                        return <ul className={'list-group'}>
                            {
                                biblSearch.getLibraries().sort(function (lib1, lib2) {
                                    var distLib1 = getDistanceToLib(lib1);
                                    var distLib2 = getDistanceToLib(lib2);
                                    return distLib1 - distLib2;
                                }).map(function (lib, index) {
                                    return <li className="list-group-item">
                                        <a  data-index={index}
                                            onclick={m.withAttr('data-index', selectLibHideModal) }>
                                            {lib.name}
                                        </a>
                                    </li>;
                                })
                            }
                        </ul>;
                    },
                    footer: function () {
                        return <button className="btn btn-primary"
                            onclick={theModal.hide.bind(theModal)}>
                            Stäng
                        </button>;
                    }
                })
            }
        </div>;
    }
};
