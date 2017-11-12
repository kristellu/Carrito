var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(express.static('client'));

var objectTest = {
  name: 'Juan',
  test:  (parametro)=>{
    console.log(objectTest.name, parametro);
  },
  clave: 'nadfadsf'
}

objectTest.test('Sebastian');

server.listen(8080, ()=>{
  console.log('Servidor escuchando en 8080');
});

