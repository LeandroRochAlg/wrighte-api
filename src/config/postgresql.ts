import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuração de conexão
const pgp = pgPromise();
const pgdb = pgp({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5433, // Convertendo para inteiro
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Teste de conexão
pgdb.connect()
  .then(obj => {
    obj.done(); // libera o recurso
    console.log("Conexão com o banco de dados PostgreSQL foi estabelecida com sucesso!");
  })
  .catch(error => {
    console.error("Erro ao conectar ao banco de dados:", error.message || error);
  });

export default pgdb;