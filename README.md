# sparschwein

Behalte die Übersicht über getätigte Einkäufe, das monatliche Budget und die Einkaufsliste.

## Features

* Lege Einkäufe an
* Lege Budgets für beliebige Zeitabschnitte an
* Behalte die Übersicht über benötigte Artikel mit einer gemeinsamen Einkaufsliste
* Berechnet automatisch, wer wieviel gezahlt hat und wer wem wieviel Geld schuldet

## Installation

Benötigt werden eine MySQL/MariaDB Datenbank, ein Server der beliebige Binaries ausführen kann (die Zielplattform kann im Production-Buildskript angepasst werden) und ggf. HTTP Basic Auth.
Anfragen an ```/api``` müssen in der Webserver-Konfiguration an localhost:8000 weitergereicht werden.
