var conexion = require('../lib/conexionbd');

function obtenerPeliculas(req, res) {
  var sql;
  //var xSql;
  var fieldsSql ="";
  var titulo = req.query.titulo;
  var anio = req.query.anio;
  var genero = req.query.genero;
  var orden =req.query.columna_orden;
  var tipoOrden = req.query.tipo_orden;
  var pagina = req.query.pagina;
  var cantidad = req.query.cantidad;
  var total;

  // Filtrar por Título, año y Género
  var filters = []

  if (titulo) {
    filters.push(`titulo LIKE '%${titulo}%'`)
  }
  if (anio) {
    filters.push(`anio = '${anio}'`)
  }
  if (genero) {
    filters.push(`genero_id = ${genero}`)
  }

  sql = "SELECT * FROM pelicula "
 
  if (titulo || anio || genero) {
      fieldsSql += " WHERE "
  }
  

   fieldsSql+= filters.join(' AND ')
  //FILTROS POR ORDEN
  var orderedFields = {
    titulo: 'titulo',
    anio: 'fecha_lanzamiento',
    puntuacion: 'puntuacion',
    duracion: 'duracion'
  }
  

  tipoOrden = tipoOrden || 'ASC'

  if (orden) {
    fieldsSql += ` ORDER BY ${orderedFields[orden]} ${tipoOrden}`
  }
  
  sql+=fieldsSql;

  xSql = "SELECT COUNT(*) AS total FROM pelicula"
  xSql+= fieldsSql;
  
  conexion.query(xSql, function(error, resultado){
   
    if (error) {
         console.log("Hubo un error en la consulta", error.message);
         return res.status(404).send("Hubo un error en la consulta");
    }
    var total = resultado[0].total;
  
    
    sql+= ` LIMIT ${(pagina - 1) * cantidad},${cantidad}`;
  
    
    conexion.query(sql, function(error, resultado){
      res.send({ peliculas: resultado,total:total });
    });
  })  
  
}
function obtenerGeneros(req, res) {
  var consultaSql = "SELECT * from genero";
  conexion.query(consultaSql, function(error, resultado, fields){
    if (error){
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    var response = {
      'generos': resultado
    };
    res.send(JSON.stringify(response));
  });
}


function obtenerInformacionPelicula(req, res){
  if (req.params.id !== 'recomendacion') {
    var id = req.params.id;
    var sql = `
      SELECT
        pelicula.*,
        genero.nombre as genero,
        actor.nombre as actor FROM pelicula
      INNER JOIN genero ON genero_id = genero.id
      INNER JOIN actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id
      INNER JOIN actor ON actor_pelicula.actor_id = actor.id
      WHERE pelicula.id = ${id}
    `
    // console.log(`id de película: ${id}`);
    
    conexion.query(sql, function(error, resultado, fields){
      if (error){
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
      }

      console.log("RESULTADO", fields)

      var response = {
        pelicula: {
          titulo: resultado[0].titulo,
          fecha_lanzamiento: resultado[0].fecha_lanzamiento,
          duracion: resultado[0].duracion,
          puntuacion: resultado[0].puntuacion,
          trama: resultado[0].trama,
          poster: resultado[0].poster,
          anio: resultado[0].anio,
          director: resultado[0].director
        },
        genero: resultado[0].genero,
        actores: resultado.map(function (res) {
          return { nombre: res.actor }
        })
      };
      console.log(response)
      res.send(JSON.stringify(response));
    });
  }
}
/*
function recomendarPelicula(req, res){
  var genero = req.query.genero;
  var anio_inicio = req.query.anio_inicio;
  var anio_fin = req.query.anio_fin;
  var puntuacion = req.query.anio_puntuacion;

  // Filtar por genero, anio, puntuación
  var filters= []
  if (genero){
    filters.push(`genero_id = ${genero}`)
  }
  if (anio_inicio){
    filters.push(`anio_inicio BETWEEN ${anio_inicio}`)
  }
  if (anio_fin){
    filters.push(`anio_fin BETWEEN ${anio_fin}`)
  }
  if(puntuacion){
    filters.push(`puntuacion = ${puntuacion}`)
  }
  var parametros = [
    {'nombre': 'genero', 'valor': genero, 'query': 
  ];

  parametros.forEach(e => {
    if (genero) {
      var sql = `SELECT * FROM  pelicula`;
      sql+= "WHERE"
    }else{
      var sql = `
            SELECT
              pelicula.*,
              genero.nombre as genero,
              actor.nombre as actor FROM pelicula
            INNER JOIN genero ON pelicula.genero_id = genero.id
            INNER JOIN actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id
            INNER JOIN actor ON actor_pelicula.actor_id = actor.id
            `;
      sql+="WHERE"
  
    }
   sql+=filters.join('AND');

  });

  conexion.query(sql, function(error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
  
    }
    var response = {
      'peliculas': resultado
    };

    res.send(JSON.stringify(response));
  });
}
*/
module.exports = {
	obtenerPeliculas: obtenerPeliculas,
  obtenerGeneros: obtenerGeneros,
  obtenerInformacionPelicula: obtenerInformacionPelicula,
  //recomendarPelicula: recomendarPelicula
};
