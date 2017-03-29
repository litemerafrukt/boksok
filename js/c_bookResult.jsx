/* global appState */
/* global biblSearch */
/* global librisSearch */
/* global Modal */
/* global m */
'use strict';

var c = c || {};

/******************************************************************
*
* The book result component. Sometimes the isbn search returns
* multiple books. With this component the user can select wich book
* to show libraries for.
* Consists of a button over the map and shows a modal with all
* books on click. If user selects a new book the controller
* initiates a new library search.
*
******************************************************************/

c.bookResult = {
    booksModal: new Modal,

    controller: function () {
        var selectBook = function (recordNr) {
            console.log('recordNr: ', recordNr);
            appState.sbr = recordNr;
            biblSearch.fetchLibraries(librisSearch.getRecord(appState.sbr).libSigels).then(null, function () {
                alert('Error in fetching libraries, please contact litemerafrukt@gmail.com. Error nr: 203');
            });
        };

        return { selectBook: selectBook };
    },

    view: function (ctrl) {
        var theModal = this.booksModal;
        return <div>
            <button className="btn btn-default btn-fab btn-fab-mini"
                onclick={theModal.show.bind(theModal)}>
                <i class="material-icons">book</i>
            </button>
            {
                theModal.view({
                    class: 'rootClass',
                    modalSizeClass: 'modal-lg',
                    header: function () {
                        return <h4>Bok</h4>;
                    },
                    body: function () {
                        var selectBookHideModal = function (index) {
                            console.log('Selected book index: ', index);
                            ctrl.selectBook(index);
                            theModal.hide();
                        };
                        return <ul className="list-group">
                            {
                                librisSearch.getRecords().map(function (book, index) {
                                    return <li className="list-group-item">
                                        <p><a data-recordNr={index}
                                              onclick={m.withAttr('data-recordNr', selectBookHideModal)}>
                                            {book.title}<br />
                                            {book.author}
                                        </a></p>
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
