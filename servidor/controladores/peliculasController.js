var conexion = require('../lib/conexionbd');

function obtenerPeliculas(req, res) {
  var sql = "SELECT * from pelicula";
  //var sql;
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

  sql = "SELECT * FROM pelicula"
  if (titulo || anio || genero) {
    sql += " WHERE "
  }
  sql += filters.join(' AND ')

  //FILTROS POR ORDEN
  var orderedFields = {
    titulo: 'titulo',
    anio: 'fecha_lanzamiento',
    puntuacion: 'puntuacion',
    duracion: 'duracion'
  }

  tipoOrden = tipoOrden || 'ASC'

  if (orden) {
    sql += ` ORDER BY ${orderedFields[orden]} ${tipoOrden}`
  }
  //PAGINACIÓN Y LIMIT
  
  sql += ` LIMIT ${(pagina - 1) * cantidad},${cantidad}`;

  conexion.query(sql, function(error, resultado){
  if (error) {
      return res.status(500).send({ error: true, message: "error." })
  }
    res.send({ peliculas: resultado });
  })
/*
  //TOTAL DE PELÍCULAS
  connection.query(sql_, function(error, resultado, fields) {
  if (error_){
    console.log("Hubo un error en la consulta", error_.message);
    return res.status(404).send("Hubo un error en la consulta");
  }

  total = resultado_.length;
  console.log(total);
  
  var response = {
      'peliculas': resultado,
      'total': total
  }; 
    res.send(JSON.stringify(response));
  });

  /*
  // Filtrar por Título, año y Género
  
  if(titulo && anio && genero){
    console.log(`título: ${titulo} \n año: ${anio} \n género: ${genero}`)
    sql+= `WHERE titulo LIKE  \'\%${titulo}\%\' AND ANIO = ${anio} AND genero_id = ${genero}`;
    console.log(sql);
  } else if(!titulo && anio && genero){
    sql+=` WHERE anio = ${anio} AND genero_id = ${genero}`;
    console.log('año y género: ' + sql);
  }else if (!anio && titulo && genero) {
    sql += ` WHERE titulo LIKE \'\%${titulo}\%\' AND genero_id = ${genero}`;
    console.log('género y título: ' + sql);
  } else if (!genero && anio && titulo) {
    sql += ` WHERE titulo LIKE \'\%${titulo}\%\' AND anio =  ${anio}`;
    console.log('año y título: ' + sql);
  } else if (titulo) {
    sql += ` WHERE titulo LIKE \'\%${titulo}\%\'`;
    console.log('sólo título: ' + sql);
  } else if (anio) {
    sql += ` WHERE anio = ${anio}`;
    console.log('sólo anio: ' + sql);
  } else if (genero) {
    sql += ` WHERE genero_id = ${genero}`;
    console.log('sólo genero: ' + sql);
  }
  */
  //FILTROS POR ORDEN

  /*
  if (orden === 'anio') {
    sql += ` ORDER BY fecha_lanzamiento ${tipoOrden}`;
  } else if (orden === 'puntuacion') {
    sql += ` ORDER BY puntuacion ${tipoOrden}`;
  } else if (orden === 'duracion') {
  sql += ` ORDER BY duracion ${tipoOrden}`;
  }
  sql_ = sql;
  */
  //PAGINACIÓN Y LIMIT
  /*
  sql += ` LIMIT ${(pagina - 1) * cantidad},${cantidad}`;

  connection.query(sql, function(error, resultado, fields) {
  if (error) {
    console.log("Hubo un error en la consulta", error.message);
    return res.status(404).send("Hubo un error en la consulta");
    console.log(sql);
  }
  //TOTAL DE PELÍCULAS
    connection.query(sql_, function(error_, resultado_, fields_) {
    if (error_){
      console.log("Hubo un error en la consulta", error_.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    total = resultado_.length;
    console.log(total);
    var response = {
      'peliculas': resultado,
      'total': total
    }; 
    res.send(JSON.stringify(response));
  });
  // agregando
  /*
  conexion.query(consultaSql, function(error, resultadoQuery){
    if (error){
      return res.status(500).send({ error: true, message: "error." })
    }
    res.send({ peliculas: resultadoQuery });
  })
  */
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
    
      //sql = `SELECT * FROM actor_pelicula INNER JOIN actor ON actor_id = actor.id WHERE pelicula_id = ${id}`
      /*
      conexion.query(sql, function(error_, resultado_, fields_) {
        if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
        }
        var response = {
          'pelicula': resultado[0],
          'genero': resultado[0].nombre,
          'actores': resultado_
        };
        res.send(JSON.stringify(response));
      });
      */
    });
  }
}
function recomendarPelicula(req, res){
  var genero = req.query.genero;
  var anio_inicio = req.query.anio_inicio;
  var anio_fin = req.query.anio_fin;
  var puntuacion = req.query.anio_puntuacion;

  var sql =`SELECT * FROM pelicula`;
  var sqlConGenero = `SELECT pelicula.id, pelicula.poster, pelicula.trama FROM pelicula`;
  var generos;

  var parametros = [
    {'nombre': 'genero', 'valor': genero, 'query': ` INNER JOIN genero ON pelicula.genero_id = genero.id WHERE genero.nombre = \'${genero}\'`},
    {'nombre': 'anio_inicio', 'valor': anio_inicio, 'query': ` AND pelicula.anio BETWEEN ${anio_inicio}`, 'querySinGenero': ` WHERE anio BETWEEN ${anio_inicio}`},
    {'nombre': 'anio_fin', 'valor':anio_fin, 'query': ` AND ${anio_fin}`, 'querySinGenero': ` AND ${anio_fin}`},
    {'nombre': 'puntuacion', 'valor': puntuacion, 'query': ` AND pelicula.puntuacion = ${puntuacion}`, 'querySinGenero': ` AND puntuacion = ${puntuacion}`}
  ];
  parametros.forEach(e => {
    if (genero) {
      if (e.valor !== "" && e.valor !== undefined) {
        sqlConGenero += e.query;
        sql = sqlConGenero;
      }
      }else if (puntuacion && !anio_inicio && !anio_fin) {
        sql = `SELECT * FROM pelicula WHERE puntuacion = ${puntuacion}`;
      }else{
        if (e.valor !== "" && e.valor !== undefined) {
          sql += e.querySinGenero;
        }
      }
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
module.exports = {
	obtenerPeliculas: obtenerPeliculas,
  obtenerGeneros: obtenerGeneros,
  obtenerInformacionPelicula: obtenerInformacionPelicula,
  recomendarPelicula: recomendarPelicula
};
