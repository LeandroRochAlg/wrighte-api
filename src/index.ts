import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes';
import { connectMongoDB } from './config/mongodb';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

// Middleware para processar JSON
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Rotas
app.use(router);

(async () => {
  try {
    await connectMongoDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
})();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});