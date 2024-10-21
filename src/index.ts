import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Middleware para processar JSON
app.use(express.json());

// Rotas
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});