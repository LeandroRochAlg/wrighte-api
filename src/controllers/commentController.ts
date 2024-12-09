import { Request, Response } from 'express';
import pgdb from '../config/postgresql';
import { mongodb } from '../config/mongodb';
import EditorService from '../services/editorService';

class CommentController {
    public async saveComment(req: Request, res: Response): Promise<any | void> {
        const { contentID, versionID, comment, selectedText } = req.body;
        const userID = req.body.user.id;

        const commentsCollection = mongodb.collection('comments');

        try {
            await commentsCollection.insertOne({ contentID, versionID, userID, comment, selectedText });

            await EditorService.addXp(userID);

            res.status(200).json({ message: 'Comentário salvo com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar comentário:', error);
            res.status(500).json({ message: 'Erro ao salvar comentário' });
        }
    }

    public async getComments(req: Request, res: Response): Promise<any | void> {
        const { contentID, versionID } = req.params;
    
        const commentsCollection = mongodb.collection('comments');
    
        try {
            // Buscar comentários no MongoDB
            const comments = await commentsCollection.find({ contentID, versionID }).toArray();
    
            // Obter os IDs de usuários dos comentários
            const userIds = comments.map(comment => Number(comment.userID)); // Converter para número
            const usersQuery = `SELECT id, username, editorlevel FROM users WHERE id = ANY($1::int[])`;
    
            // Buscar nomes de usuários e níveis de editor no PostgreSQL
            const users = await pgdb.query(usersQuery, [userIds]);
    
            // Mapear IDs para nomes de usuário e níveis de editor
            const usersMap = (users || []).reduce((acc: { [key: number]: { username: string, editorlevel: number } }, user: { id: number; username: string, editorlevel: number }) => {
                acc[user.id] = { username: user.username, editorlevel: user.editorlevel };
                return acc;
            }, {});
    
            // Combinar os comentários com os nomes de usuário, níveis de editor e retornar os campos desejados
            const commentsWithUserNames = comments.map(comment => ({
                contentID: comment.contentID,
                versionID: comment.versionID,
                comment: comment.comment,
                selectedText: comment.selectedText,
                userName: usersMap[Number(comment.userID)]?.username || 'Usuário Desconhecido', // Garantir consistência
                editorLevel: usersMap[Number(comment.userID)]?.editorlevel || 0, // Garantir consistência
            }));
    
            res.status(200).json(commentsWithUserNames);
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            res.status(500).json({ message: 'Erro ao buscar comentários' });
        }
    }
}

export default new CommentController();