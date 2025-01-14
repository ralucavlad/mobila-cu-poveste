DROP TYPE IF EXISTS categ_mobila;
DROP TYPE IF EXISTS tipuri_mobila;
DROP TYPE IF EXISTS material_exterior_produse;

CREATE TYPE categ_mobila AS ENUM('sufragerie', 'bucatarie', 'dormitor');
CREATE TYPE tipuri_mobila AS ENUM('bufet', 'vitrina', 'canapea', 'fotoliu', 'comoda', 'dulap', 'masa', 'scaun', 'noptiera');
CREATE TYPE material_exterior_produse AS ENUM('lemn', 'sticla', 'panza', 'catifea', 'piele');

CREATE TABLE IF NOT EXISTS mobila (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   imagine VARCHAR(300),
   categorie categ_mobila DEFAULT 'sufragerie',
   tip_produs tipuri_mobila DEFAULT 'bufet',
   pret NUMERIC(8,2) NOT NULL,
   inaltime INT NOT NULL CHECK (inaltime>=0),   
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   material_produs material_exterior_produse DEFAULT 'lemn',
   toate_materialele VARCHAR [],
   reducere BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT into mobila (nume, descriere, imagine, categorie, tip_produs, pret, inaltime, material_produs, toate_materialele, reducere) VALUES 
('Bufet sufragerie', 'Bufet din lemn masiv, cu 6 sertare si 2 usi', 'bufet_1_640.png', 'sufragerie', 'bufet', 1500, 100, 'lemn', '{"lemn"}', FALSE),
('Bufet bucatarie', 'Bufet din lemn masiv, cu 2 usi', 'bufet_2_640.png', 'bucatarie', 'bufet', 1000, 100, 'lemn', '{"lemn"}', TRUE),
('Vitrina', 'Vitrina cu 3 polite din sticla', 'vitrina_1_640.png', 'sufragerie', 'vitrina', 1000, 150, 'sticla', '{"lemn", "sticla"}', FALSE),
('Canapea colorata', 'Canapea cu 3 locuri', 'canapea_1_640.jpg', 'sufragerie', 'canapea', 2500, 80, 'lemn', '{"lemn", "panza"}', FALSE),
('Canapea din piele', 'Canapea cu 2 locuri', 'canapea_2_640.jpg', 'sufragerie', 'canapea', 3000, 80, 'piele', '{"lemn", "piele"}', FALSE),
('Canapea din catifea', 'Canapea cu 3 locuri, din catifea', 'canapea_3_640.png', 'sufragerie', 'canapea', 3500, 80, 'catifea', '{"lemn", "catifea"}', FALSE),
('Fotoliu galben', 'Fotoliu din catifea galbena', 'fotoliu_2_640.jpg', 'sufragerie', 'fotoliu', 1000, 100, 'catifea', '{"lemn", "catifea"}', TRUE),
('Comoda solida', 'Comoda din lemn masiv, cu 4 sertare', 'comoda_1_640.jpg', 'dormitor', 'comoda', 800, 50, 'lemn', '{"lemn"}', FALSE),
('Comoda neagra', 'Comoda neagra, cu 10 sertare', 'comoda_2_640.jpg', 'dormitor', 'comoda', 1000, 50, 'lemn', '{"lemn"}', FALSE),
('Comoda rosie', 'Comoda din lemn de cires, cu 4 sertare', 'comoda_4_640.jpg', 'dormitor', 'comoda', 800, 50, 'lemn', '{"lemn"}', FALSE),
('Dulap pictat', 'Dulap din lemn pictat, cu 2 usi', 'dulap_2_640.jpg', 'dormitor', 'dulap', 3000, 200, 'lemn', '{"lemn"}', FALSE),
('Dulap mare', 'Dulap din lemn de brad, cu 3 usi', 'dulap_3_640.jpg', 'dormitor', 'dulap', 3500, 200, 'lemn', '{"lemn"}', TRUE),
('Masa rotunda', 'Masa rotunda', 'masa_1_640.png', 'bucatarie', 'masa', 2200, 80, 'lemn', '{"lemn"}', FALSE),
('Masa mica', 'Masa rotunda pentru 2 persoane', 'masa_2_640.png', 'bucatarie', 'masa', 1200, 80, 'lemn', '{"lemn"}', FALSE),
('Scaun de bucatarie', 'Scaun din lemn masiv, cu sezut din panza', 'scaun_1_640.jpg', 'bucatarie', 'scaun', 200, 50, 'panza', '{"lemn", "panza"}', FALSE),
('Scaun alb', 'Scaun alb, cu sezut din panza', 'scaun_2_640.jpg', 'bucatarie', 'scaun', 200, 50, 'panza', '{"lemn", "panza"}', FALSE),
('Noptiera rosie', 'Noptiera din lemn de cires', 'noptiera_1_640.png', 'dormitor', 'noptiera', 300, 50, 'lemn', '{"lemn"}', FALSE),
('Noptiera alba', 'Noptiera alba fara sertare', 'noptiera_3_640.jpg', 'dormitor', 'noptiera', 300, 50, 'lemn', '{"lemn"}', FALSE),
('Noptiera butuc', 'Noptiera din butuc de lemn', 'noptiera_4_640.jpg', 'dormitor', 'noptiera', 200, 50, 'lemn', '{"lemn", "otel"}', TRUE);

