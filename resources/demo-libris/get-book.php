<?php

// set up books that should be available
$books = [
    "9789144072395" => "php.xml",
    "9789173435284" => "storebror.xml",
    "9781593275846" => "javascript.xml",
    "9780596517748" => "goodparts.xml",
    "9780596805524" => "definitiveguide.xml"
];

$no_record = "norecord.xml";
$error = "error.xml";

function sendXML($file) {
    $xml = @file_get_contents($file);
    if ($xml === FALSE) {
        header("Access-Control-Allow-Origin: *");
        header('Content-type: application/xml');
        http_response_code(500);
        die('<get-book error="php script error" />');
    }
    header("Access-Control-Allow-Origin: *");
    header('Content-type: application/xml');
    // echo $xml;
    die($xml);
}

// check query=isbn:XXXXX
// check if query exists
if (empty($_GET) || !array_key_exists('query', $_GET)) {
    sendXML($error);
}

//check that isbn is set in query and if isbn exists in books
$isbn = explode(':', $_GET['query']);

$err_count = count($isbn) !== 2;
$err_isbn = strtolower($isbn[0]) !== 'isbn';

if (    count($isbn) !== 2 ||
        strtolower($isbn[0]) !== 'isbn' ||
        !array_key_exists($isbn[1], $books)
    ){
    sendXML($no_record);
}

// If we are here we should be ok with sending book search responce
sendXML($books[$isbn[1]]);
