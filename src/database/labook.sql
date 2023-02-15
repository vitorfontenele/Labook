-- Active: 1676491070487@@127.0.0.1@3306

-- 1) TABLE users
-- query 1.1
DROP TABLE users;

-- query 1.2
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- ADMIN (inserido pelo Postman)
-- name: Carl Donovan
-- email: carldonovan@gmail.com
-- password: passw1rd

-- query 1.3
UPDATE users
SET role = "ADMIN"
WHERE email = "carldonovan@gmail.com";

-- NORMAL USERS (inseridos via Postman)
/*
(name, email, password)
("John Titor", "johntitor@gmail.com", "passw0rd")
("Julia Schmidt", "juliaschmidt@gmail.com", "passw1rd")
("Alice Grassi", "alicegrassi@gmail.com", "pasZw0rd")
*/

-- query 1.4
SELECT * FROM users;

-- 2) TABLE posts
-- query 2.1
DROP TABLE posts;

-- query 2.2
CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0),
    dislikes INTEGER DEFAULT(0),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- query 2.3
SELECT * FROM posts;

-- 3) TABLE likes_dislikes
-- query 3.1
DROP TABLE likes_dislikes;

-- query 3.2
CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    UNIQUE (user_id, post_id)
);

-- query 3.3
SELECT * FROM likes_dislikes;