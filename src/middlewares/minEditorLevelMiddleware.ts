import { Request, Response, NextFunction } from "express";
import pgdb from "../config/postgresql";

export const minEditorLevel = async (req: Request, res: Response, next: NextFunction): Promise<void | any> => {
    const userID = req.body.user.id;

    const contentID = req.params.id || req.params.contentID;

    try{
        const user = await pgdb.one('SELECT editorLevel FROM users WHERE id = $1', [userID]);

        const content = await pgdb.one('SELECT mineditorlevel, userId FROM contents WHERE id = $1', [contentID]);

        if(user.editorlevel < content.mineditorlevel && userID !== content.userid){
            return res.status(501).json({ message: 'Nível de editor insuficiente' });
        }

        // Passa o controle para o próximo middleware ou rota
        next();
    } catch (error) {
        console.error('Erro ao verificar nível de editor:', error);
        return res.status(500).json({ message: 'Erro ao verificar nível de editor' });
    }
}