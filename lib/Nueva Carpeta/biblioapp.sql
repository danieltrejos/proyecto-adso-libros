-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-05-2025 a las 21:21:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `biblioapp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `author`
--

CREATE TABLE `author` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `author`
--

INSERT INTO `author` (`id`, `name`, `state`) VALUES
(1, 'Gabriel García Márquez', 0),
(2, 'Isabel Allende', 0),
(3, 'Mario Vargas Llosa', 1),
(4, 'Laura Esquivel', 1),
(5, 'Jorge Luis Borges', 1),
(6, 'Julio Cortázar', 1),
(7, 'Carlos Fuentes', 1),
(8, 'Juan Rulfo', 1),
(9, 'Rosa Montero', 1),
(10, 'Eduardo Galeano', 1),
(11, 'Sofía Milla Martin', 1),
(12, 'Carina Sevillano-Girón', 1),
(13, 'Rubén Vilar Calatayud', 1),
(14, 'Alexandra Arce Calderon', 1),
(15, 'Wálter Berrocal Bello', 1),
(16, 'Ovidio Narváez Almagro', 1),
(17, 'Adalberto José Nieto Torralba', 1),
(18, 'Candelaria Soto Fábregas', 1),
(19, 'Hernán Leiva Barrio', 1),
(20, 'Adelardo Almazán Cantero', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `book`
--

CREATE TABLE `book` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `isbn` varchar(191) NOT NULL,
  `yearPublished` int(11) NOT NULL,
  `numPages` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 1,
  `authorId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `publisherId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `book`
--

INSERT INTO `book` (`id`, `name`, `isbn`, `yearPublished`, `numPages`, `state`, `authorId`, `categoryId`, `publisherId`, `createdAt`, `updatedAt`) VALUES
(1, 'Cien años de soledad', '9781665368957', 1966, 704, 0, 1, 10, 6, '2025-05-18 15:54:19.121', '2025-05-18 15:54:19.121'),
(2, 'El amor en los tiempos del cólera', '9781652158097', 2006, 589, 1, 1, 2, 10, '2025-05-18 15:54:19.126', '2025-05-18 16:06:02.044'),
(3, 'Crónica de una muerte anunciada', '9781514404287', 1951, 570, 1, 1, 2, 10, '2025-05-18 15:54:19.133', '2025-05-18 15:54:19.133'),
(4, 'La casa de los espíritus', '9781901226454', 2012, 617, 1, 2, 5, 10, '2025-05-18 15:54:19.138', '2025-05-18 15:54:19.138'),
(5, 'Paula', '9780004325118', 2019, 684, 1, 2, 2, 2, '2025-05-18 15:54:19.142', '2025-05-18 15:54:19.142'),
(6, 'Eva Luna', '9781292544564', 1986, 323, 1, 2, 6, 6, '2025-05-18 15:54:19.146', '2025-05-18 15:54:19.146'),
(7, 'La ciudad y los perros', '9780760894064', 1963, 136, 1, 3, 3, 2, '2025-05-18 15:54:19.150', '2025-05-18 15:54:19.150'),
(8, 'Conversación en La Catedral', '9780304480920', 1992, 281, 1, 3, 2, 8, '2025-05-18 15:54:19.153', '2025-05-18 15:54:19.153'),
(9, 'La fiesta del Chivo', '9780951343517', 2010, 494, 1, 3, 7, 5, '2025-05-18 15:54:19.157', '2025-05-18 15:54:19.157'),
(10, 'Como agua para chocolate', '9781153280174', 2002, 434, 1, 4, 4, 9, '2025-05-18 15:54:19.161', '2025-05-18 15:54:19.161'),
(11, 'Tan veloz como el deseo', '9781895234060', 2020, 326, 1, 4, 4, 3, '2025-05-18 15:54:19.164', '2025-05-18 15:54:19.164'),
(12, 'El diario de Tita', '9781715790400', 1966, 165, 1, 4, 10, 8, '2025-05-18 15:54:19.168', '2025-05-18 15:54:19.168'),
(13, 'Ficciones', '9781940521350', 1978, 762, 1, 5, 7, 9, '2025-05-18 15:54:19.172', '2025-05-18 15:54:19.172'),
(14, 'El Aleph', '9781681698243', 1990, 127, 1, 5, 9, 10, '2025-05-18 15:54:19.176', '2025-05-18 15:54:19.176'),
(15, 'El libro de arena', '9780259932918', 1968, 147, 1, 5, 10, 8, '2025-05-18 15:54:19.179', '2025-05-18 15:54:19.179'),
(16, 'Rayuela', '9780231448635', 2015, 782, 1, 6, 1, 9, '2025-05-18 15:54:19.183', '2025-05-18 15:54:19.183'),
(17, 'Final del juego', '9780822054849', 1984, 150, 1, 6, 5, 4, '2025-05-18 15:54:19.187', '2025-05-18 15:54:19.187'),
(18, 'Bestiario', '9780735367340', 2003, 377, 1, 6, 4, 2, '2025-05-18 15:54:19.190', '2025-05-18 15:54:19.190'),
(19, 'La muerte de Artemio Cruz', '9781415466971', 1957, 307, 1, 7, 6, 6, '2025-05-18 15:54:19.194', '2025-05-18 15:54:19.194'),
(20, 'Aura', '9781780800820', 1977, 751, 1, 7, 10, 7, '2025-05-18 15:54:19.198', '2025-05-18 15:54:19.198'),
(21, 'Terra Nostra', '9781597566896', 2000, 548, 1, 7, 9, 6, '2025-05-18 15:54:19.201', '2025-05-18 15:54:19.201'),
(22, 'Pedro Páramo', '9780169296292', 1953, 768, 1, 8, 6, 2, '2025-05-18 15:54:19.205', '2025-05-18 15:54:19.205'),
(23, 'El llano en llamas', '9780772352798', 1968, 562, 1, 8, 9, 3, '2025-05-18 15:54:19.209', '2025-05-18 15:54:19.209'),
(24, 'La loca de la casa', '9780055817044', 2003, 352, 1, 9, 7, 2, '2025-05-18 15:54:19.213', '2025-05-18 15:54:19.213'),
(25, 'Historia del Rey Transparente', '9780516530772', 1969, 612, 1, 9, 7, 3, '2025-05-18 15:54:19.217', '2025-05-18 15:54:19.217'),
(26, 'Las venas abiertas de América Latina', '9781516830114', 2002, 342, 1, 10, 6, 4, '2025-05-18 15:54:19.220', '2025-05-18 15:54:19.220'),
(27, 'El libro de los abrazos', '9781805299509', 1980, 155, 1, 10, 6, 10, '2025-05-18 15:54:19.224', '2025-05-18 15:54:19.224'),
(28, 'Quidem nihil', '9781564691552', 2010, 192, 0, 8, 8, 9, '2025-05-18 15:54:19.228', '2025-05-18 18:49:50.727'),
(29, 'Magni sunt sapiente', '9780261397347', 2007, 720, 0, 16, 4, 8, '2025-05-18 15:54:19.232', '2025-05-18 18:49:48.807'),
(30, 'Commodi molestias corporis', '9781608308071', 1962, 576, 0, 17, 10, 4, '2025-05-18 15:54:19.236', '2025-05-18 18:49:46.512');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `category`
--

INSERT INTO `category` (`id`, `name`, `createdAt`, `state`) VALUES
(1, 'Novela', '2025-05-18 15:54:18.984', 0),
(2, 'Cuento', '2025-05-18 15:54:18.988', 0),
(3, 'Ensayo', '2025-05-18 15:54:18.992', 1),
(4, 'Poesía', '2025-05-18 15:54:18.996', 1),
(5, 'Fantasía', '2025-05-18 15:54:18.999', 1),
(6, 'Ciencia Ficción', '2025-05-18 15:54:19.003', 1),
(7, 'Biografía', '2025-05-18 15:54:19.007', 1),
(8, 'Terror', '2025-05-18 15:54:19.010', 1),
(9, 'Romance', '2025-05-18 15:54:19.014', 1),
(10, 'Historia', '2025-05-18 15:54:19.017', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `loan`
--

CREATE TABLE `loan` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `bookId` int(11) NOT NULL,
  `loanDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `returnDue` datetime(3) NOT NULL,
  `returned` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `returnedAt` datetime(3) DEFAULT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `loan`
--

INSERT INTO `loan` (`id`, `userId`, `bookId`, `loanDate`, `returnDue`, `returned`, `createdAt`, `returnedAt`, `state`) VALUES
(1, 11, 23, '2025-04-13 20:51:46.483', '2025-04-24 20:51:46.483', 0, '2025-05-18 15:54:19.240', NULL, 1),
(2, 6, 30, '2025-05-17 20:51:46.483', '2025-05-24 20:51:46.483', 0, '2025-05-18 15:54:19.245', NULL, 1),
(3, 2, 7, '2025-05-01 20:51:46.483', '2025-05-14 20:51:46.483', 1, '2025-05-18 15:54:19.249', '2025-05-09 20:51:46.483', 1),
(4, 5, 9, '2025-04-08 20:51:46.483', '2025-04-28 20:51:46.483', 0, '2025-05-18 15:54:19.258', NULL, 1),
(5, 4, 15, '2025-03-30 20:51:46.483', '2025-04-14 20:51:46.483', 1, '2025-05-18 15:54:19.262', '2025-04-10 20:51:46.483', 1),
(6, 5, 15, '2025-04-10 20:51:46.483', '2025-04-22 20:51:46.483', 0, '2025-05-18 15:54:19.265', NULL, 1),
(7, 9, 4, '2025-04-20 20:51:46.483', '2025-05-05 20:51:46.483', 0, '2025-05-18 15:54:19.269', NULL, 1),
(8, 9, 20, '2025-05-06 20:51:46.483', '2025-05-24 20:51:46.483', 1, '2025-05-18 15:54:19.273', '2025-05-31 20:51:46.483', 1),
(9, 1, 8, '2025-04-02 20:51:46.483', '2025-04-12 20:51:46.483', 1, '2025-05-18 15:54:19.276', '2025-04-09 20:51:46.483', 1),
(10, 2, 19, '2025-03-27 20:51:46.483', '2025-04-09 20:51:46.483', 1, '2025-05-18 15:54:19.280', '2025-04-10 20:51:46.483', 1),
(11, 9, 15, '2025-04-03 20:51:46.483', '2025-04-13 20:51:46.483', 0, '2025-05-18 15:54:19.284', NULL, 1),
(12, 12, 25, '2025-04-29 20:51:46.483', '2025-05-16 20:51:46.483', 0, '2025-05-18 15:54:19.288', NULL, 1),
(13, 7, 10, '2025-04-26 20:51:46.483', '2025-05-04 20:51:46.483', 1, '2025-05-18 15:54:19.291', '2025-05-11 20:51:46.483', 1),
(14, 2, 18, '2025-04-07 20:51:46.483', '2025-04-18 20:51:46.483', 0, '2025-05-18 15:54:19.295', NULL, 1),
(15, 6, 27, '2025-04-23 20:51:46.483', '2025-05-06 20:51:46.483', 1, '2025-05-18 15:54:19.298', '2025-05-03 20:51:46.483', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publisher`
--

CREATE TABLE `publisher` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `publisher`
--

INSERT INTO `publisher` (`id`, `name`, `createdAt`, `state`) VALUES
(1, 'Alfaguara', '2025-05-18 15:54:19.023', 0),
(2, 'Planeta', '2025-05-18 15:54:19.032', 0),
(3, 'Penguin Random House', '2025-05-18 15:54:19.037', 1),
(4, 'Anagrama', '2025-05-18 15:54:19.046', 1),
(5, 'Ediciones B', '2025-05-18 15:54:19.049', 1),
(6, 'Tusquets', '2025-05-18 15:54:19.053', 1),
(7, 'Seix Barral', '2025-05-18 15:54:19.056', 1),
(8, 'Debolsillo', '2025-05-18 15:54:19.060', 1),
(9, 'Alianza', '2025-05-18 15:54:19.064', 1),
(10, 'Norma', '2025-05-18 15:54:19.067', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('ADMIN','CLIENT') NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `state`) VALUES
(1, 'Ariel Bartolomé Estévez Castrillo', 'admin1@example.com', 'admin123', 'ADMIN', '2025-05-18 15:54:19.072', 0),
(2, 'Federico del Ferrando', 'admin2@example.com', 'admin123', 'ADMIN', '2025-05-18 15:54:19.076', 0),
(3, 'Óscar Perales Lopez', 'aperello@perez-campo.net', 'cliente123', 'CLIENT', '2025-05-18 15:54:19.080', 1),
(4, 'Jose Manuel del Bernal', 'lhoyos@hotmail.com', 'cliente123', 'CLIENT', '2025-05-18 15:54:19.085', 1),
(5, 'Sebastian de Lluch', 'aromeu@luna.com', 'cliente123', 'CLIENT', '2025-05-18 15:54:19.089', 1),
(6, 'Diego Verdugo Marín', 'baezadavid@yahoo.com', 'cliente123', 'CLIENT', '2025-05-18 15:54:19.093', 1),
(7, 'Máximo Andrade Roda', 'geronimo24@gmail.com', 'cliente123', 'CLIENT', '2025-05-18 15:54:19.097', 1),
(8, 'Ágata Verdugo Tenorio', 'trinidad07@hotmail.com', 'cliente123', 'CLIENT', '2025-05-18 15:54:19.101', 1),
(9, 'Delfina Vila Bartolomé', 'mendezluz@yahoo.com', 'cliente123', 'CLIENT', '2025-05-18 15:54:19.105', 1),
(10, 'Roberto Arregui Ferrer', 'ariasmercedes@tolosa.net', 'cliente123', 'CLIENT', '2025-05-18 15:54:19.109', 1),
(11, 'Prudencio Juan Pomares', 'figueroaalbano@hotmail.com', 'cliente123', 'CLIENT', '2025-05-18 15:54:19.113', 1),
(12, 'Ángeles Valverde Pizarro', 'scarretero@anaya.es', 'cliente123', 'CLIENT', '2025-05-18 15:54:19.118', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('8d26c28d-0322-4d09-910e-1b80bb95f889', '1b6c229d0ac00570df825446649c3b087cb65be7bc69f374606d351bff5e36b0', '2025-05-18 15:53:53.278', '20250517123357_add_state', NULL, NULL, '2025-05-18 15:53:53.203', 1),
('fdd72387-62f4-43bf-ac47-91ab4e6bf390', 'ba8ff71cc797987188635a3919bf291927999584d3d4b6dd6ea97b939f9221cf', '2025-05-18 15:53:53.200', '20250517122403_init', NULL, NULL, '2025-05-18 15:53:52.749', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `author`
--
ALTER TABLE `author`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Book_authorId_fkey` (`authorId`),
  ADD KEY `Book_categoryId_fkey` (`categoryId`),
  ADD KEY `Book_publisherId_fkey` (`publisherId`);

--
-- Indices de la tabla `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `loan`
--
ALTER TABLE `loan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Loan_userId_fkey` (`userId`),
  ADD KEY `Loan_bookId_fkey` (`bookId`);

--
-- Indices de la tabla `publisher`
--
ALTER TABLE `publisher`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indices de la tabla `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `author`
--
ALTER TABLE `author`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `book`
--
ALTER TABLE `book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `loan`
--
ALTER TABLE `loan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `publisher`
--
ALTER TABLE `publisher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `book`
--
ALTER TABLE `book`
  ADD CONSTRAINT `Book_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `author` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Book_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Book_publisherId_fkey` FOREIGN KEY (`publisherId`) REFERENCES `publisher` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `loan`
--
ALTER TABLE `loan`
  ADD CONSTRAINT `Loan_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Loan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
