import { Request, Response } from 'express';
import db from '../config/database';


class bookContentController{
    public async bookContent(req: Request, res: Response) {
        const { title, content } = req.body; // Receber o título e o conteúdo

        try {
            // Insira o título e o conteúdo no banco de dados
            await db.none('INSERT INTO contents(title, content) VALUES($1, $2)', [title, content]);

            res.status(200).json({ message: 'Conteúdo salvo com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar conteúdo:', error);
            res.status(500).json({ message: 'Erro ao salvar conteúdo' });
        }
    }
}

export default new bookContentController();