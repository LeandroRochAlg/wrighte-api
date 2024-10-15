import pgPromise from 'pg-promise';

// Configuração de conexão
const pgp = pgPromise();
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'WrightE',
  user: 'postgresql',
  password: '1212'
});

export default db;