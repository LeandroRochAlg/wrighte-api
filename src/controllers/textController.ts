import { Request, Response } from 'express';
import db from '../config/database';
import jwt from 'jsonwebtoken';

class TextController {
    public async saveContent(req: Request, res: Response) {
        const { title, content } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        try {
            const decoded = jwt.verify(token, 'secret') as { id: number };

            // Insira o título, conteúdo e userID no banco de dados
            await db.none('INSERT INTO contents(title, content, userID) VALUES($1, $2, $3)', [title, content, decoded.id]);

            res.status(200).json({ message: 'Conteúdo salvo com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar conteúdo:', error);
            res.status(500).json({ message: 'Erro ao salvar conteúdo' });
        }
    }

    public async getUserContents(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }
    
        try {
            const decoded = jwt.verify(token, 'secret') as { id: number };
    
            const contents = await db.any('SELECT id, title FROM contents WHERE userID = $1', [decoded.id]);
    
            res.status(200).json(contents);
        } catch (error) {
            console.error('Erro ao buscar conteúdos do usuário:', error);
            res.status(500).json({ message: 'Erro ao buscar conteúdos' });
        }
    }

    public async getContentById(req: Request, res: Response) {
        const { id } = req.params; // Obtém o ID a partir dos parâmetros da URL
        const token = req.headers.authorization?.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }
    
        try {
            const decoded = jwt.verify(token, 'secret') as { id: number };
    
            // Busca o conteúdo específico do usuário com base no userID e contentID
            const content = await db.oneOrNone('SELECT title, content FROM contents WHERE id = $1 AND userID = $2', [id, decoded.id]);
    
            if (!content) {
                return res.status(404).json({ message: 'Conteúdo não encontrado' });
            }
    
            res.status(200).json(content);
        } catch (error) {
            console.error('Erro ao buscar conteúdo:', error);
            res.status(500).json({ message: 'Erro ao buscar conteúdo' });
        }
    }
}

export default new TextController();