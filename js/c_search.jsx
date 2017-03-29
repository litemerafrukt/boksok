/* global appState */
/* global librisSearch */
/* global biblSearch */
/* global helpers */
/* global Modal */
/* global m */
'use strict';

var c = c || {};

/******************************************************************
* The isbn search komponent
* The controll center and main functions of the app.
* Consists of three buttons and a textfield.
*
* Camera button is a file-selector with custom icon workaround. After
* user selected a new file, or took a picture on mobile, we do a
* Quagga JS search and decode for an EAN barcode in the file.
*
* Text field is used both as a fallback to manual input of isbn and
* as a messagee field. Eg after search it displays the title of the
* the book or a message the search returned empty.
*
* Then there is the search button that searches libris and
* biblioteksdatabasen.
*
* Last is the history button that displays a modal with previous
* searches from appState.history.
*
******************************************************************/
c.search = {
    historyModal: new Modal,

    controller: function () {
        var isbnStr = m.prop('');

        /**
        * Main search engine. Uses the search objects "librisSearch" and
        * "biblSearch". Searches are asyncron with promise and this func
        * is responsible for error messages.
        *
        * @param none
        *
        * @return none
        **/
        var fetch = function () {
            // Reset selected book record
            appState.sbr = 0;
            // Reset map to user pos
            appState.map.requestUserCenter = true;
            // trim and strip all '-'
            var isbn = isbnStr().trim().split('-').join('');

            // Exit if no isbn
            if (isbn.length === 0) {
                return;
            }
            console.log('fetching: ', isbn);
            librisSearch.fetchIsbn(isbn).then(function (nrOfRecords) {
                // clear libraries
                biblSearch.clearLibraries();

                // if no records, show error
                if (nrOfRecords === 0) {
                    isbnStr('Libris hittade inget på sökningen.');
                    return;
                } else if (nrOfRecords < 0) {
                    console.log('Error in query, please contact litemerafrukt@gmail.com. Error nr: 101');
                    alert('Error in query, please contact litemerafrukt@gmail.com. Error nr: 101');
                    return;
                }

                // Save first titel and isbn to history
                var title = librisSearch.getRecord(0).title;
                var isbn = isbnStr();

                appState.history.add(title, isbn);
                // clear isbnStr
                isbnStr('');

                // Now we have a one or more books so lets fetch libs for record[0]
                biblSearch.fetchLibraries(librisSearch.getSigels(0)).then(null, function () {
                    console.log('Error in fetching libraries, please contact litemerafrukt@gmail.com. Error nr: 202');
                    alert('Error in fetching libraries, please contact litemerafrukt@gmail.com. Error nr: 202');
                });
            }, function () {
                console.log('Failed to connect to libris server');
                alert('Failed to connect to libris server');
            });
        };

        /**
        * Decodes an EAN barcode and display in textfield via isbnStr()
        *
        * @param {array} - chosen files, uses file with index [0]
        *
        * @return none
        **/
        var decode = function (files) {
            if (files && files.length) {
                isbnStr('Läser isbn...');
                helpers.decodeImage(
                    URL.createObjectURL(files[0]),
                    function (isbn) {
                        m.startComputation();
                        isbnStr(isbn);
                        m.endComputation();
                    },
                    function () {
                        m.startComputation();
                        isbnStr('Hittade inget isbn i bilden');
                        m.endComputation();
                    }
                );
            }
        };

        /**
        * Get title of selected book to show in textfield
        *
        * @return {string} - title of selected book
        **/
        var getTitle = function () {
            return librisSearch.getRecord(appState.sbr).title || '';
        };

        return {
            fetch: fetch,
            isbn: isbnStr,
            decode: decode,
            getTitle: getTitle
        };
    },

    view: function (ctrl) {
        var theModal = this.historyModal;

        return <div className="panel panel-default">
            <div className="input-group input-group-sm">

                <div className="input-group-btn">
                    <span className="btn btn-file">
                        <i class="material-icons">photo_camera</i>
                        <input type="file" capture onchange={m.withAttr('files', ctrl.decode)} />
                    </span>
                </div>

                <input  type="tel" className="form-control search-field"
                        placeholder="ISBN"
                        onchange={m.withAttr('value', ctrl.isbn)}
                        value={ctrl.isbn() || ctrl.getTitle()} />

                <div className="input-group-btn">
                    <button className="btn" type="button" onclick={ctrl.fetch}>
                        <i class="material-icons">search</i>
                    </button>
                </div>
                <div className="input-group-btn">
                    <button type="button" className="btn"
                            onclick={theModal.show.bind(theModal)}>
                            <i class="material-icons history">youtube_searched_for</i>
                    </button>
                </div>
                {
                    theModal.view({
                        class: 'rootClass',
                        modalSizeClass: 'modal-lg',
                        header: function () {
                            return <h4>Historik</h4>;
                        },
                        body: function () {
                            var selectBookHideModal = function (isbn) {
                                ctrl.isbn(isbn);
                                theModal.hide();
                            };
                            return <div>
                                {
                                    appState.history.getHistory().map(function (book) {
                                        return <p><a data-isbn={book.isbn}
                                            onclick={m.withAttr('data-isbn', selectBookHideModal)}>
                                            {book.title}
                                        </a></p>;
                                    })
                                }
                        </div>;
                        },
                        footer: function () {
                            return <button className="btn btn-primary"
                                onclick={theModal.hide.bind(theModal)}>
                                Stäng
                            </button>;
                        }
                    })
                }
            </div>
        </div>;
    }
};
