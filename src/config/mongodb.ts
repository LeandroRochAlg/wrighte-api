import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

let client: MongoClient;
export let mongodb: Db;

export const connectMongoDB = async () => {
    if (!client) {
        try {
            client = new MongoClient(uri);
            await client.connect();
            console.log("Conexão com o banco de dados MongoDB foi estabelecida com sucesso!");
        } catch (error) {
            console.error("Erro ao conectar ao MongoDB:", error);
            throw error;
        }
    }

    mongodb = client.db(process.env.MONGODB_DB_NAME || "mydatabase");
}