-- Active: 1676000213886@@127.0.0.1@3306

-- TABLE users
-- query a
DROP TABLE users;

-- query b
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- query c
INSERT INTO users (id, name, email, password, role, created_at) VALUES
    ("u001", "John Titor", "johntitor@gmail.com", "passw0rd", "author", "2022-06-03T11:45:23Z"),
    ("u002", "Carl Donovan", "carldonovan@gmail.com", "passw1rd", "admin", "2023-01-17T09:32:12Z");

-- query d
SELECT * FROM users;

-- TABLE posts
-- query e
DROP TABLE posts;

-- query f
CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0),
    dislikes INTEGER DEFAULT(0),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- query g
INSERT INTO posts(id, creator_id, content, likes, dislikes, created_at, updated_at) VALUES 

