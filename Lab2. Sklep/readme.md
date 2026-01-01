# Sklep

Aplikacja pozwala na symulowanie działania sklepu, pozwalając na dodawanie produktów oraz zarządznie koszykiem (dodawanie do koszyka, usuwanie, edycja ilości). Dodatkowo, wdrożone zostało symulowanie złożenia zamówienia.

#

## Uruchomienie

Aby zainstalować i uruchomić aplikację należy uprzednio pobrać repozytorium z GitHub. Aplikacja testowana była w wersji Node.js 20.19.3

Aby zainstalować wszystkie niezbędne zależności oraz uruchomić część backendową aplikacji należy znajdując się w folderze głównym repozytorium uruchomić poniższe komendy.

```bash
  cd Backend
  npm install
  node app.js
```

Po uruchomieniu api (część backendowa) część frontendowa aplikacji dostępna jest od razu, aby ją uruchomić wystarczy za pomocą przeglądarki internetowej uruchomić dowolny plik HTML znajdujący się w folderze Frontend.

## Struktura katalogów

Projekt podzielony jest na dwa głowne katalogi: Backend oraz Frontend.

Backend:  
a) controllers - kontrolery aplikacji  
b) database - połączenie z bazą danych  
c) models - funkcje wykonujące zapytania do bazy danych  
d) routes - routingi API podzielone na segmenty zgodne z zagadnieniem  
e) app.js - główny plik aplikacji  
f) shop.db - plik bazy danych sqlite, tworzy się automatycznie przy pierwszym uruchomieniu aplikacji  
g) tables.sql - spis tabel bazy danych  
h) tests.res - plik testowy API, pozwala na szybkie przeprowadzenie testów funkcjonalności API

Frontend:  
a) js - skrypty JS niezbędne do obsługi frontendu aplikacji

Dodatkowo repozytorium zawiera folder Happy screenshots w którym zawarte są zrzuty ekranu z poprawnego działania aplikacji.
