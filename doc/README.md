# Documentació bàsica del projecte
Ha d'incloure, com a mínim
## Instruccions per desplegar el projecte a producció
Quins fitxers s'han d'editar i com (típicament per connectar la BD etc...)

En el directori /front , s'ha de fer:
- $ npm install
- $ npm start

En el directori /back/codexpert-laravel, hem de fer:
- $ composer update
- $ composer install
- $ npm install
- $ cp .env.example .env
- Omplir les credencials de la base de dades
- $ php artisan key:generate
- $ php artisan migrate

En el directori /back/codexpert-node, hem de fer:
- $ npm install
- $ node index.js (?)

## Instruccions per seguir codificant el projecte
eines necessaries i com es crea l'entorn per que algú us ajudi en el vostre projecte.

## API / Endpoints / punts de comunicació
Heu d'indicar quins són els punts d'entrada de la API i quins són els JSON que s'envien i es reben a cada endpoint
