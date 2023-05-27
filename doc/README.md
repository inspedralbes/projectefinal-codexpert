# Documentació bàsica del projecte
CodeXpert és una aplicació web que té com a objectiu ensenyar a programar competitint amb altre gent. És el projecte final de grau de l'institut Pedralbes de Barcelona i està desenvolupat pels alumnes Alessia Crisafo, Gaspar Gómez, Asmae Charroud, i Martí Sala.
## Instruccions per desplegar el projecte en local
En el directori /front , s'ha de fer:
- $ npm install
- $ npm start
- $ cp .env.example .env
- Omplir amb les rutes de Laravel i de Websockets en el .env

En el directori /back/codexpert-laravel, hem de fer:
- $ composer update
- $ composer install
- $ npm install
- $ cp .env.example .env
- Omplir les credencials de la base de dades en el .env
- $ php artisan key:generate
- $ php artisan migrate --seed (cada cop que es vulgui actualitzar s'ha de fer la comanda php artisan migrate:fresh --seed)

En el directori /back/codexpert-node, hem de fer:
- $ npm install
- $ cp .env.example .env
- Omplir la ruta de Laravel en el .env
- $ npm run start

## Instruccions per seguir codificant el projecte
### Laravel
Tots els arxius estàn en la carpeta "./back/codexpert-laravel" i per fer peticions a aquest fem servir la ruta "web.php". També cal esmentar que hi ha moltes dades ja creades pel sistema, les quals es poden canviar en la carpeta "databaseSeeder.php", aquestes dades són tant per tenir preguntes per defecte en la web, com pels NPC's o per crear usuaris de test. Tot està guardat en un servidor MySQL.
### NodeJS
En la carpeta "./back/codeXpert-node", està el fitxer "index.js" en el qual estàn totes les configuracions de websocket que es fan servir tant per les sales d'espera com per el chat de text o dins de la partida els usuaris connectats amb les seves dades i la pròrroga. Després també hi han totes les conexions de websockets en la carpeta 
### React
React està dins de la carpeta de "./front" i en aquest tenim separats els components en dugues carpetes: 

- pages
- components

La carpeta de "pages" és la que utilitzem com a plantilla per posar altres components o informació dintre, mentre que la de "components" és la carpeta on desem totes les funcionalitats del projecte, per exemple la LandingPage.js té informació com el nom del projecte, una breu introducció d'aquest i un botó per començar però també té el component "Header.js" dins per a que els usuaris que hagin iniciat sessió puguin navegar entre pàgines més fàcilment.
### Phaser
Dins de la carpeta "./front/Phaser" hi han totes les configuracions, arxius que s'han utilitzat per fer el món de codeXpert. Junt amb aquests hi han les textures utiltzades de l'autor shubibubi, que hem contractat per a que el món quedi molt més amigable.
### Estils
Estàn dins de la carpeta "./front" està separat per components o per funcionalitats, per exemple hi ha "addQuestion.css" que serveix per estila el component concret, però després també hi ha el fitxer "form.css" que serveix per estilar tots els formularis.


## API / Endpoints / punts de comunicació
En la carpeta "./back/codexpert-laravel/routes/web.php" podem veure totes les rutes que hi han i si anem a aquestes en el Laravel està apuntat tots els JSON's que s'envien, què reben i per a que utilitzem cada parametre.