import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import pgdb from '../config/postgresql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthController {
    public async login(req: Request, res: Response) {
        const { email, password } = req.body;
    
        try {
            const user = await pgdb.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
    
            if (!user) {
                return res.status(400).json({ message: 'Usuário não encontrado' });
            }
    
            const validPassword = await bcrypt.compare(password, user.password);
    
            if (!validPassword) {
                return res.status(400).json({ message: 'Senha inválida' });
            }
    
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string || 'secret', { expiresIn: '30d' });
    
            // Retorna o token de autenticação e o username
            return res.status(200).json({ token, username: user.username });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(500).json({ message: 'Erro ao fazer login' });
        }
    }

    public async logout(_req: Request, res: Response) {
        res.status(200).json({ message: 'Logout realizado com sucesso' });
        res.json({token: null});
    }

    public async register(req: Request, res: Response) {
        const { username, email, password } = req.body;

        try{
            const existeUser = await pgdb.oneOrNone(
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

            await pgdb.none(
                "INSERT INTO users(username, email, password) VALUES($1, $2, $3)",
                [username, email, passwordCrypt]
            );
        
            res.status(200).json({message:"Usuário cadastrado com sucesso"});

        } catch(error){
            console.error('Erro ao adicionar usuário:', error);
            res.status(500).json({ message: 'Erro ao adicionar usuário' });
        }
    }
}

export default new AuthController();