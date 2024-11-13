import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void | any> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        // Enviar a resposta e encerrar a função
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        // Verifica e extrai o ID do token
        const verified = jwt.verify(token, process.env.JWT_SECRET as string || 'secret');
        req.body.user = verified;
        
        // Passa o controle para o próximo middleware ou rota
        next();
    } catch (error) {
        // Enviar a resposta e encerrar a função
        console.error('Erro ao verificar token:', error);
        return res.status(500).json({ message: 'Erro ao verificar token' });
    }
};