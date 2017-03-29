#!/usr/bin/env bash

# Webbutveckling med PHP och MySQL, Montathar Faraon
wget -O php.xml "http://libris.kb.se/xsearch?query=isbn:9789144072395&holdings=true&format=mods"

# Storebror ser dig, Glenn Greenwald
wget -O storebror.xml "http://libris.kb.se/xsearch?query=isbn:9789173435284&holdings=true&format=mods"

# Eloquent javascript
wget -O javascript.xml "http://libris.kb.se/xsearch?query=isbn:9781593275846&holdings=true&format=mods"

# Javascript the good parts
wget -O goodparts.xml "http://libris.kb.se/xsearch?query=isbn:9780596517748&holdings=true&format=mods"

# JavaScript the definitive guide
wget -O definitiveguide.xml "http://libris.kb.se/xsearch?query=isbn:9780596805524&holdings=true&format=mods"

# No record, isbn not found
wget -O norecord.xml "http://libris.kb.se/xsearch?query=isbn:jhgkjhgkkjhg&holdings=true&format=mods"

# Error
wget -O error.xml "http://libris.kb.se/xsearch?"
