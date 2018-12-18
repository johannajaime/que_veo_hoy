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
function recomendarPelicula (req, res) {
  console.log("-->",req.query);
  var fieldsSql ="";
  var genero = req.query.genero;
  var genero_id = req.query.genero_id;
  var anio_inicio = req.query.anio_inicio;
  var anio_fin = req.query.anio_fin;
  var puntuacion = req.query.puntuacion;
  var sql;
  
    // Filtrar por estreno, puntuacion, clasico
  var filters = []
 
  if(anio_inicio && anio_fin){
    filters.push(` anio BETWEEN '${anio_inicio}' AND '${anio_fin}'`)
  }
  if(puntuacion){
    filters.push(` puntuacion = '${puntuacion}'`) 
    console.log("puntuacion");
  }
  if (genero){
    filters.push(`nombre = '${genero}'`)
  }
  
  if (filters.length) {
      fieldsSql += " WHERE " + filters.join(' AND ')
  }

  if (genero){
    sqlCon=`
    SELECT
        pelicula.*,
        genero.nombre as genero
      FROM pelicula
      INNER JOIN genero ON pelicula.genero_id = genero.id
    `
    sqlCon+=fieldsSql;
    sql=sqlCon
    console.log("--*>", sql);
  }else{
    sqlSin= `SELECT pelicula.* FROM pelicula`;
    sqlSin+=fieldsSql;
    sql=sqlSin
  }
  console.log("-->", sql);
   conexion.query(sql, function(error, resultado) {
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
