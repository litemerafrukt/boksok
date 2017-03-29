/* global m */

/******************************************************************
* The main app. Renders in div id="app" from html doc.
* Components defined in separet .jsx
******************************************************************/

(function () {
    'use strict';

    /******************************************************************
    * Model
    * the model consists of three object:
    *   librisSearch - search for books and hold result of search
    *   biblSearch - search for libraries and hold result of search
    *   appState - contains ui-state for controllers to watch, also
    *              contatins the history
    ******************************************************************/
    /* global biblSearch */

    /****************************
    * App state object
    ****************************/
    /* global appState */

    /******************************************************************
    * Components with views and controllers
    * located in separate .jsx files, under namespace "c"
    ******************************************************************/


    /******************************************************************
    *          - M a i n  a p p  c o m p o n e n t s -                *
    ******************************************************************/

    var app = {}; // main ui _app_ components

    app.search = {
        view: function () {
            return <c.search />;
        }
    };

    app.books = {
        view: function () {
            return <c.bookResult />;
        }
    };

    app.libraries = {
        view: function () {
            return <c.libResult />;
        }
    };

    app.map = {
        view: function () {
            return <c.map
                lat={appState.map.lat}
                lng={appState.map.lng}
                libs={biblSearch.getLibraries()}
                centerOnUser={appState.map.requestUserCenter}
            />;
        }
    };

    /******************************************************************
    * App view
    ******************************************************************/
    // The main buildingblocks of the app to mount components to

    var App = (function () {
        return {
            view: function() {
                return <div id="screen">
                    <div id="map"></div>
                    <div className="controllers container col-md-5">
                        <div className="row">
                            <div id="search" className="search"></div>
                        </div>
                    </div>
                    <div className="result-tools btn-group-sm">
                        <div id="libraries" className="libraries"></div>
                        <div id="books" className="books"></div>
                    </div>
                </div>;
            }
        };
    })();

    // initialize the application view
    // First render the "core" html-elements
    m.render(document.getElementById('app'), App);

    // Mount Main Components
    m.mount(document.getElementById('map'), app.map);
    m.mount(document.getElementById('search'), app.search);
    m.mount(document.getElementById('books'), app.books);
    m.mount(document.getElementById('libraries'), app.libraries);

})();
