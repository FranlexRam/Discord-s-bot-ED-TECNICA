const db = require ('./index');

db.prepare(`
CREATE TABLE users (
    discord_id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL    
)
`).run();

console.log('Tablas creadas');