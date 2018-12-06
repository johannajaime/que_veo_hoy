DROP DATABASE IF EXISTS queVeoHoy;
CREATE DATABASE IF NOT EXISTS queVeoHoy;
USE queVeoHoy;

CREATE TABLE IF NOT EXISTS  `pelicula` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `titulo` TEXT(100) NOT NULL,
    `duracion` INT(5) NOT NULL,
    `director` TEXT(400) NOT NULL,
    `anio` INT(5) NOT NULL,
    `fecha_lanzamiento` DATE NOT NULL,
    `puntuacion` INT(2) NOT NULL,
    `poster` TEXT(300) NOT NULL,
    `trama` TEXT(700) NOT NULL,
    `genero_id` INT NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE IF NOT EXISTS  `actor` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `nombre` TEXT(70) NOT NULL,

    PRIMARY KEY (`Id`)
);
CREATE TABLE IF NOT EXISTS  `actor_pelicula` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `autor_id` INT NOT NULL,
    `pelicula_id` INT NOT NULL,

    PRIMARY KEY (`Id`)
);
CREATE TABLE `genero` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` CHAR(30) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
)