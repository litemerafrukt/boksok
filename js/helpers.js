/* global Quagga */
'use strict';

/******************************************************************
* Helpers
******************************************************************/
var helpers = helpers || {};

/**
* Get the distance between point 1 and 2 on our globe
* from: http://stackoverflow.com/a/1502821
*
* @param {object} - latlng
* @param {object} - latlng
*
* @return distance
**/
helpers.getDistance = function(p1, p2) {
    /**
    * Return radians
    * from: http://stackoverflow.com/a/1502821
    **/
    var rad = function(x) {
        return x * Math.PI / 180;
    };

    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};

/**
* Decoded the barcode in the image using quagga js. Calls succesCallback on sucessfull
* decoding or failCallback on nothihng found.
*
* @param {object} - the fileUrl from camera or filesystem
* @param {function} - succesCallback
* @param {function} - failCallback
*
* @return void
**/
helpers.decodeImage = function (fileUrl, succesCallback, failCallback) {
    var config = {
        decoder: {
            readers: [{
                format: 'ean_reader',
                config: {}
            }]
        },
        locate: true, // try to locate the barcode in the image
        src: fileUrl
    };

    Quagga.decodeSingle(config, function (result) {
        if (result && result.codeResult) {
            succesCallback(result.codeResult.code);
            console.log('Quagga found:', result.codeResult.code);
        } else {
            failCallback('No isbn detected');
        }
    });
};
