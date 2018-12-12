//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');


var app = express();

var peliculasController = require('./controladores/peliculasController');

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//routing
app.get('/peliculas', peliculasController.obtenerPeliculas);
app.get('/generos', peliculasController.obtenerGeneros);
app.get('/peliculas/:id', peliculasController.obtenerInformacionPelicula);
app.get('/recomendaciones', peliculasController.recomendarPelicula);


//se setea el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});
