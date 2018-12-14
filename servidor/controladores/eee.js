function buscarPeliculas (req, res) {
   let sql = 'SELECT * FROM pelicula';
   let sql_;
   let titulo = req.query.titulo;
   let anio = req.query.anio;
   let genero = req.query.genero;
   let orden =req.query.columna_orden;
   let tipoOrden = req.query.tipo_orden;
   let pagina = req.query.pagina;
   let cantidad = req.query.cantidad;
   let total;

 //FILTROS POR TÍTULO, AÑO Y GÉNERO
   if (titulo && anio && genero) {
     console.log(`título: ${titulo} \n año: ${anio} \n género: ${genero}`)
     sql += ` WHERE titulo LIKE \'\%${titulo}\%\' AND anio = ${anio} AND genero_id = ${genero}`;
     console.log(sql);
   } else if (!titulo && anio && genero) {
     sql += ` WHERE anio = ${anio} AND genero_id = ${genero}`;
     console.log('año y género: ' + sql);
   } else if (!anio && titulo && genero) {
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
     console.log('sólo año: ' + sql);
   } else if (genero) {
     sql += ` WHERE genero_id = ${genero}`;
     console.log('sólo género: ' + sql);
   }

 //FILTROS POR ORDEN
   if (orden === 'anio') {
     sql += ` ORDER BY fecha_lanzamiento ${tipoOrden}`;
     console.log(sql);
   } else if (orden === 'puntuacion') {
     sql += ` ORDER BY puntuacion ${tipoOrden}`;
     console.log(sql);
   } else if (orden === 'duracion') {
     sql += ` ORDER BY duracion ${tipoOrden}`;
     console.log(sql);
   }
   sql_ = sql;
   //PAGINACIÓN Y LIMIT
   sql += ` LIMIT ${(pagina - 1) * cantidad},${cantidad}`;

   connection.query(sql, function(error, resultado, fields) {
     if (error) {
         console.log("Hubo un error en la consulta", error.message);
         return res.status(404).send("Hubo un error en la consulta");
         console.log(sql);
     }
     //TOTAL DE PELÍCULAS
     connection.query(sql_, function(error_, resultado_, fields_) {
       if (error_) {
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
   });
 }
