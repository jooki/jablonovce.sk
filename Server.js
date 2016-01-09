var express = require("express");
var app     = express();
var path    = require("path");

app.use(express.static(__dirname + '/'));
//app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/rs-plugin'));
//app.use(express.static(__dirname + '/site_launch'));
app.use(express.static(__dirname + '/video'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/about',function(req,res){
  res.sendFile(path.join(__dirname+'/about.html'));
});

app.get('/contact',function(req,res){
  res.sendFile(path.join(__dirname+'/contacts.html'));
});

app.get('/farm',function(req,res){
  res.sendFile(path.join(__dirname+'/farm.html'));
});

app.listen(8080);

console.log("Running at Port 8080");