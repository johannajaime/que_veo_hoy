function recomendarPelicula (req, res) {
   console.log(req.query);
   var fieldsSql ="";
   var genero = req.query.params.genero;
   var anio_inicio = req.query.params.anio_inicio;
   var anio_fin = req.query.params.anio_fin;
   var puntuacion = req.query.params.puntuacion;
   var sql;
  
    // Filtrar por estreno, puntuacion, clasico
  var filters = []
 
  if (estreno){
  	filters.push(` anio BETWEEN '${anio_inicio}' AND '${anio_fin}'`)
  }
  if(clasico){
  	filters.push(` anio BETWEEN '${anio_inicio}' AND '${anio_fin}'`)
  }
  if(puntuacion){
  	filters.push(` puntuacion = '${puntuacion}'`)
 
  }
  if (genero){
    filters.push(`genero_id = ${genero}`)
  }
  sqlSin= `SELECT pelicula.* FROM pelicula`;
  if (estreno || clasico || puntuacion|| genero) {
      fieldsSql += " WHERE "
  }
  	fieldsSql+=fields.JOIN(' AND')

   console.log(sql);
fieldsSl=INNER JOIN genero ON pelicula.genero_id = genero.id WHERE genero.nombre = \'${genero}\'`}
  if (genero){
  	sqlCon=`
  	SELECT
        pelicula.*,
        genero.nombre as genero,
      FROM pelicula
      INNER JOIN genero ON pelicula.genero_id = genero.id
      WHERE pelicula.genero_id = ${genero}
  	`
  	sqlCon+=fieldsSql;
  	sql=sqlCon
  }else{
  	sqlSin+=fieldsSql;
  	sql=sqlSin
  }
   connection.query(sql, function(error, resultado, fields) {
     if (error) {

         console.log("Hubo un error en la consulta", error.message);
         return res.status(404).send("Hubo un error en la consulta");
     }
     var response = {
       'peliculas': resultado
     };

     res.send(JSON.stringify(response));
 });
// }