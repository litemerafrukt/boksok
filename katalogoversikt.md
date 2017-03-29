# Katalogöversikt och filer
Tillsammans med projektkatalogen ligger även en katalog `playgrounds` som innehåller ett antal småprogram som jag skrev för att testa och lära mig saker som jag behövde kunna i projektet.

Utöver katalogerna och filerna listade här har jag några dependencies som ligger i `me/lib`. 

Fonten och iconfonten jag använder laddas från Google cdn.

```bash
proj/
├── apple-touch-icon.png  # Icon för iOS homescreen
├── css
│   └── style.css
│
├── example-barcodes
│   │ # Bilder för att enkelt testa appen från desktopbrowser
│   │
│   ├── BlurryJavascriptGoodParts.jpg  # Fil som appen ska misslyckas läsa
│   ├── JavascriptDefGuide.jpg
│   ├── JavascriptGoodParts.jpg
│   ├── StorebrorSerDig.jpg
│   └── WebbutvecklingPHPMySQL.jpg
│
├── favicon.ico
├── img
│   │
│   # Diverse bilder som används av appen inklusive iconer för Android
│
├── index.html  # Det är här allting börjar...
│
├── js
│   ├── app.jsx          # Main-skriptet
│   ├── appState.js      # Ett objekt för komponenter att dela state, model-layer
│   ├── biblSearch.js    # Bibliotekssökobjektet, model-layer
│   ├── c_bookResult.jsx # Komponenent för att lista boksöksresulat
│   ├── c_libResult.jsx  # Komponent för att lista bibliotekssökresultat
│   ├── c_map.jsx        # Kartkomponenten, mithril wrapper runt Google Maps.
│   ├── c_search.jsx     # Sökfältskomponenten
│   ├── helpers.js       # Hjälpfunktioner inklusive QuaggaJS för barcodeläsning
│   └── librisSearch.js  # Boksöksobjektet, model-layer
│
├── manifest.json  # Används vid "add to homescreen" på Android
├── readme-img
│   │
│   # Bilder som används i readme.md
│   
├── readme.html          # Skript för att visa readme.md
├── readme.md            # Kort presentation och manual
├── katalogoversikt.html # Skript för att visa katalogoversikt.md
├── katalogoversikt.md   # Denna filen
│
└── resources
    │   # Egna utvecklingsvarianter av tjänsterna libris och biblioteksdatabasen
    ├── demo-bibliotek
    │   ├── biblioteksdatabasen.csv   # Används ej efter uppdatering
    │   ├── biblioteksdatabasen.json  # Används av mikrotjänsten get-biblio.php
    │   ├── biblioteksdatabasen.xlsx  # Från biblioteksdatabasen
    │   ├── csv2json.py       # Eget skript för att konvertera csv till json
    │   ├── get-bibl.bash     # Uppdaterar ./demo-bibliotek
    │   ├── get-biblio.php    # Microtjänst för att fråga efter bibliotek mha sigler
    │   └── xlsx2csv.py       # Konverterar excel-filer till csv, från github.
    ├── demo-libris
    │   ├── definitiveguide.xml  # Libris-svar på isbn:9780596805524
    │   ├── error.xml            # Libris-svar vid felaktig request
    │   ├── get-book.php         # Microtjänst för att söka efter böcker via isbn
    │   ├── get-libris.bash      # Uppdaterar ./demo-libris
    │   ├── goodparts.xml        # Libris-svar på isbn:9780596517748
    │   ├── javascript.xml       # Libris-svar på isbn:9781593275846
    │   ├── norecord.xml         # Libris-svar när libris inte hittar något
    │   ├── php.xml              # Libris-svar på isbn:9789144072395
    │   └── storebror.xml
    └── update-sources.bash  # Kör denna för att uppdatera samtliga resurser
```