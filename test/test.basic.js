// prepne rezim do testovacieho modu a nebude vyhadzovat chyby sposobene v test class
process.env.NODE_ENV = 'test';
// je potrebne definovat lebo parameter 
// --require should v opts nefunguje
var should = require('should')