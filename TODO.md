## Úlohy ktore musia byt implementovane
* [Detail aktivit](#detail-aktivit)
* [Emaily](#emaily)
* [Obsadené teríny](#obsadene-teriny)
* [Obmedzenia pre rezervacii](#obmedzenia-pre-rezervacii)
* [Úprava fotiek](#uprava-fotiek)
* [Testovacie nastroje](#testovacie-nastroje)
* [Príprava produkcie](#priprava-produkcie)
    
## Index 
    ~~upravit slaider a napojit na DB~~
    ~~upravit nacitavanie v casti aktivity~~
       
## Detail aktivit
    * Dohodnute ze sa nebude realizovať
        . vytvorit stranku pre detail aktivi
        
## Emaily
    . posielanie emailov pozivatelom systemu o rezervaciach a dotazoch
    . http://www.sitepoint.com/sending-email-using-node-js/
    
## Obsadené teríny
    . evidovat rezervovane terminy do DB
    . rozhranie pre zadavanie rezervacii
    
## Obmedzenia pre rezervacii
    ~~nacitanie v rezervaciach obsadené terminy~~
    . obsadene terminy vyznacit cervenou? 
    ~~obmedzit rezervaciu terminy ak sa v rozpaty vyskytuje rezervacia terminu~~

## Úprava fotiek
    ~~pripravit sadu fotiek pre web
    ~~prisposobyt pozadovanym velkostiam
    
## Testovacie nastroje
    . zapracovat testovaci nastroj pre otestovanie spravnosti 
    . skusit zatoazove testy 
    . preskusat beh na produkcnom servery
    
## Príprava produkcie
    . instalacia servera
    . instalacia node.js
    . konfigurácia pre servera
    . nsadenie projektu
    . zatažovy test
    
## Vylepsenia
    * [logovanie uprav zmien a cinnosti na servery] (https://github.com/winstonjs/winston.git)
    * [zapracovanie jednotneho layoutu] (https://github.com/JacksonTian/ejs-mate.git)
    . editacia vsetkych hodnot v databaze pre uzivatelsku opravu 
    . pridavanie aktivit
    * [primitivne prihlasenie sa do systemu (autentifikacia)] (https://github.com/jshttp/basic-auth.git)
    . zapracovat error stranky pri nespravnom zadani url
     
## Pomocne linky
    ejs : http://ejs.co , https://github.com/mde/ejs.git
    testovanie API : http://www.getpostman.com , https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
    tsd moduly pre : https://github.com/DefinitelyTyped/tsd
    TypeScript Definition manager for DefinitelyTyped : http://definitelytyped.org/tsd/
    Epress Routing Beginners : http://jilles.me/express-routing-the-beginners-guide/
    How can I merge properties of two JavaScript objects dynamically? : http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
    Node.js v4.2.4 : https://nodejs.org/dist/latest-v4.x/docs/api/ 
    NeDB : https://www.npmjs.com/package/nedb
    A mostly reasonable approach to JavaScript - how we write Node.js at RisingStack:
    https://github.com/RisingStack/node-style-guide#arrays
    
    Ghost simple powerful publishing platform: https://github.com/TryGhost/Ghost
    
    NPM Managery:
    * [Nips](http://eirikb.github.io/nipster)
    http://node-modules.com
    https://www.npmjs.com
        