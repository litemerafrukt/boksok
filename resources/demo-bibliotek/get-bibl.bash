#!/usr/bin/env bash

# Get the library list as xlsx
wget -O biblioteksdatabasen.xlsx "http://biblioteksdatabasen.libris.kb.se/excelexport/"
wait $!

# Installation xlsx2csv:
#   sudo easy_install xlsx2csv
#   or
#   pip install xlsx2csv

# Convert with xlsx2cvs, use | as delimiter
./xlsx2csv.py -e -d"|" biblioteksdatabasen.xlsx biblioteksdatabasen.csv
wait $!

# Convert using own script to json object in file
./csv2json.py biblioteksdatabasen.csv > biblioteksdatabasen.json
