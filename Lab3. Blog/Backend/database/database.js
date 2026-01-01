const Database = require("better-sqlite3");
const database = new Database("blog.db");

database.pragma("foreign_keys = ON");

database.exec(`
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved INTEGER DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
`);

module.exports = database;
