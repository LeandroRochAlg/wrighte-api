import { Request, Response } from 'express';
import db from '../config/database';


class bookContentController{
    public async bookContent(req: Request, res: Response){
    const { content } = req.body;

    try {
        // Insira seu código para salvar o conteúdo no banco de dados
        await db.none('INSERT INTO contents(content) VALUES($1)', [content]);

        res.status(200).json({ message: 'Conteúdo salvo com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar conteúdo:', error);
        res.status(500).json({ message: 'Erro ao salvar conteúdo' });
    }
    }
}

export default new bookContentController();