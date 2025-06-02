-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-06-2025 a las 19:30:00
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_books`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `authors`
--

CREATE TABLE `authors` (
  `id_author` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `state` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `authors`
--

INSERT INTO `authors` (`id_author`, `name`, `state`) VALUES
(1, 'Gabriel García Márquez', 1),
(2, 'Jorge Luis Borges', 1),
(3, 'Isabel Allende', 1),
(4, 'Mario Vargas Llosa', 1),
(5, 'Daniel Trejos', 0),
(6, 'Mario Benedetti', 1),
(7, 'Gabriel García Márquez', 1),
(8, 'Isabel Allende', 1),
(9, 'Mario Vargas Llosa', 1),
(10, 'Laura Esquivel', 1),
(11, 'Jorge Luis Borges', 1),
(12, 'Julio Cortázar', 1),
(13, 'Carlos Fuentes', 1),
(14, 'Juan Rulfo', 1),
(15, 'Rosa Montero', 1),
(16, 'Eduardo Galeano', 1),
(17, 'Eliseo Vega', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `books`
--

CREATE TABLE `books` (
  `id_book` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `id_author` int(11) NOT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `year_published` year(4) DEFAULT NULL,
  `num_pages` int(11) DEFAULT NULL,
  `id_category` int(11) NOT NULL,
  `id_publisher` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `state` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `books`
--

INSERT INTO `books` (`id_book`, `name`, `id_author`, `isbn`, `year_published`, `num_pages`, `id_category`, `id_publisher`, `created_at`, `updated_at`, `state`) VALUES
(2, 'Inventario I', 6, '1561616188618', '1953', 232, 12, 1, '2025-05-18 20:47:09', '2025-05-21 18:38:52', 0),
(3, 'Cien años de soledad', 1, '9780307474728', '1967', 417, 1, 1, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(4, 'El amor en los tiempos del cólera', 1, '9788497592208', '1985', 348, 1, 2, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(5, 'Crónica de una muerte anunciada', 1, '9780307387738', '1981', 120, 2, 3, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(6, 'La casa de los espíritus', 2, '9780553383805', '1982', 433, 1, 4, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(7, 'Paula', 2, '9780063021740', '1994', 480, 3, 5, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(8, 'Eva Luna', 2, '9788497592390', '1987', 322, 1, 1, '2025-05-18 21:41:09', '2025-05-18 22:20:26', 1),
(9, 'La ciudad y los perros', 3, '9788439720210', '1963', 432, 1, 6, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(10, 'Conversación en La Catedral', 3, '9788439720211', '1969', 601, 1, 7, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(11, 'La fiesta del Chivo', 3, '9788466319504', '2000', 528, 1, 8, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(12, 'Como agua para chocolate', 4, '9780385474016', '1989', 246, 1, 9, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(13, 'Tan veloz como el deseo', 4, '9788497932140', '2001', 240, 1, 10, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(14, 'El diario de Tita', 4, '9786070727423', '2016', 224, 1, 1, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(15, 'Ficciones', 5, '9780307950925', '1944', 174, 2, 2, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(16, 'El Aleph', 5, '9788437623056', '1949', 272, 2, 3, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(17, 'Rayuela', 6, '9788437602990', '1963', 736, 1, 4, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(18, 'Bestiario', 6, '9788496290616', '1951', 168, 2, 5, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(19, 'Final del juego', 6, '9788481097154', '1956', 208, 2, 6, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(20, 'Aura', 7, '9789682324055', '1962', 62, 1, 7, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(21, 'La muerte de Artemio Cruz', 7, '9788437602235', '1962', 288, 1, 8, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(22, 'Pedro Páramo', 8, '9786070702680', '1955', 128, 1, 9, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(23, 'El llano en llamas', 8, '9789684115163', '1953', 160, 2, 10, '2025-05-18 21:41:09', '2025-05-19 01:36:49', 1),
(24, 'La loca de la casa', 9, '9788433973988', '2003', 288, 3, 1, '2025-05-18 21:41:09', '2025-05-20 23:42:53', 1),
(25, 'Historia del Rey Transparente', 9, '9788466322313', '2005', 448, 3, 2, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(26, 'Las venas abiertas de América Latina', 10, '9786070303276', '1971', 360, 5, 3, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(27, 'El libro de los abrazos', 10, '9789682322761', '1989', 280, 5, 4, '2025-05-18 21:41:09', '2025-05-18 21:41:09', 1),
(28, 'La biblia', 7, '54657868768768', '0000', 800, 5, 8, '2025-05-20 00:21:05', '2025-05-20 00:21:05', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id_category` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `state` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id_category`, `name`, `state`) VALUES
(1, 'Novela', 1),
(2, 'Poesía', 1),
(3, 'Ensayo', 1),
(4, 'Ciencia Ficción', 1),
(5, 'Historia', 1),
(6, 'Novela', 1),
(7, 'Cuento', 1),
(8, 'Ensayo', 1),
(9, 'Poesía', 1),
(10, 'Fantasía', 1),
(11, 'Ciencia Ficción', 1),
(12, 'Biografía', 1),
(13, 'Terror', 1),
(14, 'Romance', 1),
(15, 'Historia', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `loans`
--

CREATE TABLE `loans` (
  `id_loan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_book` int(11) NOT NULL,
  `loan_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `return_due` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `returned` tinyint(1) NOT NULL DEFAULT 0,
  `returned_at` timestamp NULL DEFAULT NULL,
  `state` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `loans`
--

INSERT INTO `loans` (`id_loan`, `id_user`, `id_book`, `loan_date`, `return_due`, `returned`, `returned_at`, `state`) VALUES
(1, 2, 2, '2025-05-18 21:17:37', '2025-05-25 05:00:00', 1, '2025-05-18 21:18:08', 1),
(42, 11, 24, '2025-05-18 22:10:27', '2025-05-20 05:00:00', 1, '2025-05-18 22:10:39', 1),
(43, 11, 24, '2025-05-18 22:10:39', '2025-06-02 22:10:39', 1, '2025-05-18 22:29:27', 1),
(44, 10, 19, '2025-05-18 22:16:00', '2025-05-29 05:00:00', 1, '2025-05-19 02:52:00', 1),
(45, 10, 13, '2025-05-18 22:18:53', '2025-05-30 05:00:00', 1, '2025-05-20 00:24:05', 1),
(46, 8, 22, '2025-05-18 22:19:05', '2025-06-05 05:00:00', 1, '2025-05-19 01:55:26', 1),
(47, 6, 26, '2025-05-18 22:30:59', '2025-05-22 00:00:00', 1, '2025-05-19 02:24:49', 1),
(48, 11, 22, '2025-05-19 01:54:40', '2025-05-26 05:00:00', 1, '2025-05-20 12:50:12', 1),
(49, 8, 22, '2025-05-19 01:55:26', '2025-06-03 01:55:26', 0, NULL, 1),
(50, 7, 15, '2025-05-19 02:26:09', '2025-05-26 05:00:00', 0, NULL, 1),
(51, 2, 5, '2025-05-19 20:08:54', '2025-05-26 05:00:00', 0, NULL, 1),
(52, 5, 27, '2025-05-21 18:39:08', '2025-05-28 05:00:00', 1, '2025-05-21 18:39:14', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publishers`
--

CREATE TABLE `publishers` (
  `id_publisher` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `state` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `publishers`
--

INSERT INTO `publishers` (`id_publisher`, `name`, `state`) VALUES
(1, 'Planeta', 1),
(2, 'Penguin Random House', 1),
(3, 'Anagrama', 1),
(4, 'Tusquets', 0),
(5, 'Planeta', 1),
(6, 'Penguin Random House', 1),
(7, 'Anagrama', 1),
(8, 'Tusquets', 1),
(9, 'Debolsillo', 1),
(10, 'Norma', 1),
(11, 'Alfaguara', 1),
(12, 'Seix Barral', 1),
(13, 'Ediciones B', 1),
(14, 'Ariel', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','CLIENT') NOT NULL DEFAULT 'CLIENT',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `state` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id_user`, `name`, `email`, `password`, `role`, `created_at`, `state`) VALUES
(1, 'Admin User', 'admin@example.com', 'admin123', 'ADMIN', '2025-05-18 19:35:10', 1),
(2, 'Client User', 'client@example.com', 'client123', 'CLIENT', '2025-05-18 19:35:10', 1),
(3, 'Ana María González', 'admin1@example.com', 'admin123', 'ADMIN', '2025-05-18 21:40:56', 1),
(4, 'Luis Fernando Ramírez', 'admin2@example.com', 'admin123', 'ADMIN', '2025-05-18 21:40:56', 1),
(5, 'Carlos Pérez', 'cliente1@example.com', 'cliente123', 'CLIENT', '2025-05-18 21:40:56', 1),
(6, 'Laura Martínez', 'cliente2@example.com', 'cliente123', 'CLIENT', '2025-05-18 21:40:56', 1),
(7, 'Andrés Rodríguez', 'cliente3@example.com', 'cliente123', 'CLIENT', '2025-05-18 21:40:56', 1),
(8, 'Sofía Torres', 'cliente4@example.com', 'cliente123', 'CLIENT', '2025-05-18 21:40:56', 1),
(9, 'Julián Gómez', 'cliente5@example.com', 'cliente123', 'CLIENT', '2025-05-18 21:40:56', 1),
(10, 'Valentina Ruiz', 'cliente6@example.com', 'cliente123', 'CLIENT', '2025-05-18 21:40:56', 1),
(11, 'Camilo Herrera', 'cliente7@example.com', 'cliente123', 'CLIENT', '2025-05-18 21:40:56', 1),
(12, 'Natalia Castro', 'cliente8@example.com', 'cliente123', 'CLIENT', '2025-05-18 21:40:56', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`id_author`);

--
-- Indices de la tabla `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id_book`),
  ADD KEY `fk_author` (`id_author`),
  ADD KEY `fk_category` (`id_category`),
  ADD KEY `fk_publisher` (`id_publisher`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_category`);

--
-- Indices de la tabla `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id_loan`),
  ADD KEY `fk_user` (`id_user`),
  ADD KEY `fk_book` (`id_book`);

--
-- Indices de la tabla `publishers`
--
ALTER TABLE `publishers`
  ADD PRIMARY KEY (`id_publisher`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `authors`
--
ALTER TABLE `authors`
  MODIFY `id_author` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `books`
--
ALTER TABLE `books`
  MODIFY `id_book` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `loans`
--
ALTER TABLE `loans`
  MODIFY `id_loan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de la tabla `publishers`
--
ALTER TABLE `publishers`
  MODIFY `id_publisher` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `fk_author` FOREIGN KEY (`id_author`) REFERENCES `authors` (`id_author`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_publisher` FOREIGN KEY (`id_publisher`) REFERENCES `publishers` (`id_publisher`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `fk_book` FOREIGN KEY (`id_book`) REFERENCES `books` (`id_book`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
