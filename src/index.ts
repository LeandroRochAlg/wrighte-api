import express, { Request, Response } from 'express';
import bcrypt from "bcrypt";
import db from "./config/database";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

// Middleware para processar JSON
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try{
    const existeUser = await db.oneOrNone(
      "SELECT * FROM users WHERE email = $1 or username = $2", [email, username]
    );
  
    if (existeUser) {
      // Se o email ou username já existir, retorna uma mensagem de erro apropriada
      if (existeUser.email === email) {
        res.status(400).json({ message: 'Email já está em uso' });
      }
      if (existeUser.username === username) {
        res.status(400).json({ message: 'Username já está em uso' });
      }
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordCrypt = await bcrypt.hash(password, salt);

    await db.none(
      "INSERT INTO users(username, email, password) VALUES($1, $2, $3)",
      [username, email, passwordCrypt]
    );
  
    res.status(200).json({message:"Usuário cadastrado com sucesso"});

  } catch(error){
    console.error('Erro ao adicionar usuário:', error);
    res.status(500).json({ message: 'Erro ao adicionar usuário' });
  }


});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try{
    const user = await db.oneOrNone(
      "SELECT * FROM users WHERE email = $1", [email]
    );

    if (!user) {
      res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Senha inválida' });
    }

    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });

    res.status(200).json({ token });

  } catch(error){
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

app.post("/logout", async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout realizado com sucesso' });
  res.json({token: null});
});


//Verificacao do banco de dados [DEBUG]
app.get("/users", async (req: Request, res: Response) => {
  try{
    const users = await db.manyOrNone("SELECT * FROM users");
    res.status(200).json(users);
  } catch(error){
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});