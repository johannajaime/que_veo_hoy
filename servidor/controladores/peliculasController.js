var conexion = require('../lib/conexionbd');

function obtenerPeliculas(req, res) {
  var consultaSql = "SELECT * from pelicula";
  var sql_;
  var titulo = req.query.titulo;
  var anio = req.query.anio;
  var genero = req.query.genero;
  var orden =req.query.columna_orden;
  var tipoOrden = req.query.tipo_orden;
  var pagina = req.query.pagina;
  var cantidad = req.query.cantidad;
  var total;
  // Filtrar por Título, año y Género
  if(titulo && anio && genero){
    sql+= `WHERE titulo LIKE  \'\%${titulo}\%\' AND ANIO = ${anio} AND genero_id = ${genero}`;
  } else if(!titulo && anio && genero){
    sql+=` WHERE anio = ${anio} AND genero_id = ${genero}`;
  }else if (!anio && titulo && genero) {
    sql += ` WHERE titulo LIKE \'\%${titulo}\%\' AND genero_id = ${genero}`;
  } else if (!genero && anio && titulo) {
    sql += ` WHERE titulo LIKE \'\%${titulo}\%\' AND anio =  ${anio}`;
  } else if (titulo) {
    sql += ` WHERE titulo LIKE \'\%${titulo}\%\'`;
  } else if (anio) {
    sql += ` WHERE anio = ${anio}`;
  } else if (genero) {
    sql += ` WHERE genero_id = ${genero}`;
  }
  //FILTROS POR ORDEN
  if (orden === 'anio') {
    sql += ` ORDER BY fecha_lanzamiento ${tipoOrden}`;
  } else if (orden === 'puntuacion') {
    sql += ` ORDER BY puntuacion ${tipoOrden}`;
  } else if (orden === 'duracion') {
  sql += ` ORDER BY duracion ${tipoOrden}`;
  }
  sql_ = sql;
  //PAGINACIÓN Y LIMIT
  sql += ` LIMIT ${(pagina - 1) * cantidad},${cantidad}`;
  //TOTAL DE PELÍCULAS
    connection.query(sql_, function(error_, resultado_, fields_) {
    if (error_) {
      return res.status(404).send("Hubo un error en la consulta");
    }
  total = resultado_.length;
  var response = {
      'peliculas': resultado,
      'total': total
    }; 
   res.send(JSON.stringify(response));
       });
   });
 }
  // agregando
  conexion.query(consultaSql, function(error, resultadoQuery){
    if (error){
      return res.status(500).send({ error: true, message: "error." })
    }
    res.send({ peliculas: resultadoQuery });
  })
}
function obtenerGeneros(req, res) {
  var consultaSql = "SELECT * from genero";
  conexion.query(consultaSql, function(error, resultadoQuery){
    if (error){
      return res.status(500).send({ error: true, message: "error." })
    }
    res.send({ generos: resultadoQuery });
  })
}
module.exports = {
	obtenerPeliculas: obtenerPeliculas
};
