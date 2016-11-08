# SevenSeas
IBM Marketplace Language Mapping

The purpose of this repo is to establish the language mapping used to determine
document language hierarchy.

For Example (WCM Views):
```
English
|- en-uk: en-ukByIdDelta -> enById
|- en-ca: en-caByIdDelta -> enById
|- en-bm: en-bmByIdDelta -> enById

Français
|- fr-fr: frById

French Canadian (FRCA)
|- fr-ca: fr-caById

Español
|- es-es: es-esByIdDelta-> esById

Español - Latin America
|- es-mx: es-mxByIdDelta -> es-laById
|- es-pe: es-peByIdDelta -> es-laById

ETC...
```
