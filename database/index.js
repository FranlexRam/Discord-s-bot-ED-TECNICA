const Database = require('better-sqlite3');
const db = new Database('bot.db');

//Usar la base de datos en cada archivo (cada DB)
module.exports = db;