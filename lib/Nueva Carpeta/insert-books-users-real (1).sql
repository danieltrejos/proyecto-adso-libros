-- Insertar autores
INSERT INTO authors (name, state) VALUES
('Gabriel García Márquez', 1),
('Isabel Allende', 1),
('Mario Vargas Llosa', 1),
('Laura Esquivel', 1),
('Jorge Luis Borges', 1),
('Julio Cortázar', 1),
('Carlos Fuentes', 1),
('Juan Rulfo', 1),
('Rosa Montero', 1),
('Eduardo Galeano', 1);

-- Insertar categorías
INSERT INTO categories (name, state) VALUES
('Novela', 1),
('Cuento', 1),
('Ensayo', 1),
('Poesía', 1),
('Fantasía', 1),
('Ciencia Ficción', 1),
('Biografía', 1),
('Terror', 1),
('Romance', 1),
('Historia', 1);

-- Insertar editoriales
INSERT INTO publishers (name, state) VALUES
('Planeta', 1),
('Penguin Random House', 1),
('Anagrama', 1),
('Tusquets', 1),
('Debolsillo', 1),
('Norma', 1),
('Alfaguara', 1),
('Seix Barral', 1),
('Ediciones B', 1),
('Ariel', 1);

-- Insertar usuarios con nombres reales
INSERT INTO users (name, email, password, role, state) VALUES
('Ana María González', 'admin1@example.com', 'admin123', 'ADMIN', 1),
('Luis Fernando Ramírez', 'admin2@example.com', 'admin123', 'ADMIN', 1),
('Carlos Pérez', 'cliente1@example.com', 'cliente123', 'CLIENT', 1),
('Laura Martínez', 'cliente2@example.com', 'cliente123', 'CLIENT', 1),
('Andrés Rodríguez', 'cliente3@example.com', 'cliente123', 'CLIENT', 1),
('Sofía Torres', 'cliente4@example.com', 'cliente123', 'CLIENT', 1),
('Julián Gómez', 'cliente5@example.com', 'cliente123', 'CLIENT', 1),
('Valentina Ruiz', 'cliente6@example.com', 'cliente123', 'CLIENT', 1),
('Camilo Herrera', 'cliente7@example.com', 'cliente123', 'CLIENT', 1),
('Natalia Castro', 'cliente8@example.com', 'cliente123', 'CLIENT', 1);

-- Insertar libros
INSERT INTO books (name, id_author, isbn, year_published, num_pages, id_category, id_publisher, state) VALUES
('Cien años de soledad', 1, '9780307474728', 1967, 417, 1, 1, 1),
('El amor en los tiempos del cólera', 1, '9788497592208', 1985, 348, 1, 2, 1),
('Crónica de una muerte anunciada', 1, '9780307387738', 1981, 120, 2, 3, 1),
('La casa de los espíritus', 2, '9780553383805', 1982, 433, 1, 4, 1),
('Paula', 2, '9780063021740', 1994, 480, 3, 5, 1),
('Eva Luna', 2, '9788497592390', 1987, 320, 1, 1, 1),
('La ciudad y los perros', 3, '9788439720210', 1963, 432, 1, 6, 1),
('Conversación en La Catedral', 3, '9788439720211', 1969, 601, 1, 7, 1),
('La fiesta del Chivo', 3, '9788466319504', 2000, 528, 1, 8, 1),
('Como agua para chocolate', 4, '9780385474016', 1989, 246, 1, 9, 1),
('Tan veloz como el deseo', 4, '9788497932140', 2001, 240, 1, 10, 1),
('El diario de Tita', 4, '9786070727423', 2016, 224, 1, 1, 1),
('Ficciones', 5, '9780307950925', 1944, 174, 2, 2, 1),
('El Aleph', 5, '9788437623056', 1949, 272, 2, 3, 1),
('Rayuela', 6, '9788437602990', 1963, 736, 1, 4, 1),
('Bestiario', 6, '9788496290616', 1951, 168, 2, 5, 1),
('Final del juego', 6, '9788481097154', 1956, 208, 2, 6, 1),
('Aura', 7, '9789682324055', 1962, 62, 1, 7, 1),
('La muerte de Artemio Cruz', 7, '9788437602235', 1962, 288, 1, 8, 1),
('Pedro Páramo', 8, '9786070702680', 1955, 128, 1, 9, 1),
('El llano en llamas', 8, '9789684115163', 1953, 160, 2, 10, 1),
('La loca de la casa', 9, '9788433973988', 2003, 288, 3, 1, 1),
('Historia del Rey Transparente', 9, '9788466322313', 2005, 448, 3, 2, 1),
('Las venas abiertas de América Latina', 10, '9786070303276', 1971, 360, 5, 3, 1),
('El libro de los abrazos', 10, '9789682322761', 1989, 280, 5, 4, 1);

-- Insertar préstamos
INSERT INTO loans (id_user, id_book, loan_date, return_due, returned, returned_at, state) VALUES
(3, 1, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1, NOW(), 1),
(4, 2, NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 0, NULL, 1),
(5, 3, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), 1, NOW(), 1),
(6, 4, NOW(), DATE_ADD(NOW(), INTERVAL 8 DAY), 0, NULL, 1),
(7, 5, NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 1, NOW(), 1),
(8, 6, NOW(), DATE_ADD(NOW(), INTERVAL 9 DAY), 0, NULL, 1),
(9, 7, NOW(), DATE_ADD(NOW(), INTERVAL 12 DAY), 1, NOW(), 1),
(10, 8, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 1, NOW(), 1),
(3, 9, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 0, NULL, 1),
(4, 10, NOW(), DATE_ADD(NOW(), INTERVAL 11 DAY), 1, NOW(), 1),
(5, 11, NOW(), DATE_ADD(NOW(), INTERVAL 13 DAY), 0, NULL, 1),
(6, 12, NOW(), DATE_ADD(NOW(), INTERVAL 9 DAY), 1, NOW(), 1),
(7, 13, NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 0, NULL, 1),
(8, 14, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1, NOW(), 1),
(9, 15, NOW(), DATE_ADD(NOW(), INTERVAL 8 DAY), 0, NULL, 1),
(10, 16, NOW(), DATE_ADD(NOW(), INTERVAL 9 DAY), 1, NOW(), 1),
(3, 17, NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), 1, NOW(), 1),
(4, 18, NOW(), DATE_ADD(NOW(), INTERVAL 12 DAY), 0, NULL, 1),
(5, 19, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), 1, NOW(), 1),
(6, 20, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 0, NULL, 1);