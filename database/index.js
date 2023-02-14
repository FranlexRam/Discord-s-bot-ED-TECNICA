const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('bot.db', (err) => {
  if (err) {
    console.log(err);
    console.log('No conecto la base de datos');
  }
  console.log('Conecto a la base de datos');
});

//Usar la base de datos en cada archivo (cada DB)
module.exports = db;