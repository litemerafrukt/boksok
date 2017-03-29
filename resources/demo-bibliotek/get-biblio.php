<?php

// Read json from file
$bibl_json = @file_get_contents('./biblioteksdatabasen.json');

if ($bibl_json === FALSE) {
    header("Access-Control-Allow-Origin: *");
    header('Content-type: application/json');
    http_response_code(500);
    die(json_encode(array("Error" => "No library list on server.")));
}

$libraries = json_decode($bibl_json, true);

// some functions, because DRY
function libAnswerObj($lib) {
    $lib_obj = [];
    $lib_obj['name'] = $lib['Bibliotek'];
    $lib_obj['longitude'] = $lib['Longitud'];
    $lib_obj['latitude'] = $lib['Latitud'];
    $lib_obj['url'] = $lib['Webbadress'];
    $lib_obj['alive'] = true;
    $lib_obj['address'] = Array();
    $lib_obj['address'][]['city'] = $lib['Ort']; // This is fucking awesome syntax! LOL!!!
    return $lib_obj;
}

function getDump($libraries) {
    $lib_array = array_slice($libraries['libraries'], 0, 200);
    $lib_array = array_map('libAnswerObj', $lib_array);
    return $lib_array;
}

// Check if sigel is defined, otherwise return error dump
if (empty($_GET) || !array_key_exists('sigel', $_GET)) {
    $answer['libraries'] = getDump($libraries);
} else {
    // get an array from the sigel query
    $sigels = explode(',', strtolower($_GET['sigel']));

    $answer = ['libraries' => []];
    // Loop over all libraries and look for the sigels
    foreach ($libraries['libraries'] as $library) {
        foreach($sigels as $sigel) {
            if (strtolower($library['Sigel']) === $sigel) {
                // add to answer
                $answer['libraries'][] = libAnswerObj($library);
            }
        }
    }
    // if there was no match return first 200 libraries
    if (count($answer['libraries']) === 0) {
        $answer['libraries'] = getDump($libraries);
    }
}

header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
echo json_encode($answer);
