#!/usr/bin/env bash

# get libris books
cd ./demo-libris || exit
./get-libris.bash

cd ..

# get biblioteksdatabasen
cd ./demo-bibliotek || exit
./get-bibl.bash
