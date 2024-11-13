import { Request, Response } from 'express';
import pgdb from '../config/postgresql';

class TextController {
    public async saveContent(req: Request, res: Response): Promise<any | void> {
        const { title, content } = req.body;

        try {
            // Insira o título, conteúdo e userID no banco de dados
            await pgdb.none('INSERT INTO contents(title, content, userID) VALUES($1, $2, $3)', [title, content, req.body.user.id]);

            res.status(200).json({ message: 'Conteúdo salvo com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar conteúdo:', error);
            res.status(500).json({ message: 'Erro ao salvar conteúdo' });
        }
    }

    public async getUserContents(req: Request, res: Response): Promise<any | void> {
        try {
            const contents = await pgdb.any('SELECT id, title FROM contents WHERE userID = $1', [req.body.user.id]);
    
            res.status(200).json(contents);
        } catch (error) {
            console.error('Erro ao buscar conteúdos do usuário:', error);
            res.status(500).json({ message: 'Erro ao buscar conteúdos' });
        }
    }

    public async getContentById(req: Request, res: Response): Promise<any | void> {
        const { id } = req.params; // Obtém o ID a partir dos parâmetros da URL
    
        try {
            // Busca o conteúdo específico do usuário com base no userID e contentID
            const content = await pgdb.oneOrNone('SELECT title, content FROM contents WHERE id = $1 AND userID = $2', [id, req.body.user.id]);
    
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