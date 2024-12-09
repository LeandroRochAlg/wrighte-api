import { Request, Response } from 'express';
import pgdb from '../config/postgresql';
import { mongodb } from '../config/mongodb';
import { ObjectId } from 'mongodb';
import TextService from '../services/textService';

class TextController {
    public async saveContent(req: Request, res: Response): Promise<any | void> {
        const { title, content, minEditorLevel } = req.body;

        const contentVersionsCollection = mongodb.collection('contentVersions');

        try {
            // Insira o título, conteúdo e userID no banco de dados
            const contentID = await pgdb.one('INSERT INTO contents(title, userID, mineditorlevel) VALUES($1, $2, $3) RETURNING id', [title, req.body.user.id, minEditorLevel]);

            const contentVersionID = new ObjectId().toString();
            const contentVersion = {
                id: contentVersionID,
                content,
                date: new Date(),
            }

            const contentVersions = [contentVersion];
            const newContent = {
                title,
                contentID: contentID.id,
                userID: req.body.user.id,
                creationDate: new Date(),
                lastVersion: contentVersionID,
                contentVersions,
            }

            await contentVersionsCollection.insertOne(newContent);
            
            TextService.atributePoints(content, req.body.user.id);

            res.status(200).json({ message: 'Conteúdo salvo com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar conteúdo:', error);
            res.status(500).json({ message: 'Erro ao salvar conteúdo' });
        }
    }

    public async saveContentVersion(req: Request, res: Response): Promise<any | void> {
        const { id } = req.body;
        const { content } = req.body;

        const contentVersionsCollection = mongodb.collection('contentVersions');

        try {
            const contentVersionID = new ObjectId().toString();
            const contentVersion = {
                id: contentVersionID,
                content,
                date: new Date(),
            }

            const contentVersions = await contentVersionsCollection.findOne({ contentID: id });

            if (!contentVersions) {
                return res.status(404).json({ message: 'Conteúdo não encontrado' });
            }

            contentVersions.contentVersions.push(contentVersion);
            contentVersions.lastVersion = contentVersionID;

            await contentVersionsCollection.updateOne({ contentID: id }, { $set: contentVersions });
            
            TextService.atributePoints(content, req.body.user.id);

            res.status(200).json({ message: 'Versão do conteúdo salva com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar versão do conteúdo:', error);
            res.status(500).json({ message: 'Erro ao salvar versão do conteúdo' });
        }
    }
    
    public async getContentVersionsList(req: Request, res: Response): Promise<any | void> {
        const { id } = req.params; // Obtém o ID a partir dos parâmetros da URL
        
        const contentVersionsCollection = mongodb.collection('contentVersions');
        
        try {
            const contentVersions = await contentVersionsCollection.findOne({ contentID: parseInt(id) });

            if (!contentVersions) {
                return res.status(404).json({ message: 'Conteúdo não encontrado' });
            }

            const versionsList = contentVersions.contentVersions
                .map((version: any) => ({
                    id: version.id,
                    date: version.date,
                }))
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            res.status(200).json(versionsList);
        } catch (error) {
            console.error('Erro ao buscar versões do conteúdo:', error);
            res.status(500).json({ message: 'Erro ao buscar versões do conteúdo' });
        }
    }

    public async getContentVersions(req: Request, res: Response): Promise<any | void> {
        const { id } = req.params; // Obtém o ID a partir dos parâmetros da URL
        
        const contentVersionsCollection = mongodb.collection('contentVersions');

        try {
            const contentVersions = await contentVersionsCollection.findOne({ contentID: parseInt(id) });
            
            if (!contentVersions) {
                return res.status(404).json({ message: 'Conteúdo não encontrado' });
            }
            
            res.status(200).json(contentVersions.contentVersions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (error) {
            console.error('Erro ao buscar versões do conteúdo:', error);
            res.status(500).json({ message: 'Erro ao buscar versões do conteúdo' });
        }
    }

    public async getContentVersion(req: Request, res: Response): Promise<any | void> {
        const { contentID, versionID } = req.params; // Obtém o ID a partir dos parâmetros da URL
        
        const contentVersionsCollection = mongodb.collection('contentVersions');
        
        try {
            const contentVersions = await contentVersionsCollection.findOne({ contentID: parseInt(contentID) });

            if (!contentVersions) {
                return res.status(404).json({ message: 'Conteúdo não encontrado' });
            }

            const version = contentVersions.contentVersions.find((version: any) => version.id === versionID);

            version.title = contentVersions.title;
            version.isOwner = contentVersions.userID === req.body.user.id;

            if (!version) {
                return res.status(404).json({ message: 'Versão do conteúdo não encontrada' });
            }
            
            res.status(200).json(version);
        } catch (error) {
            console.error('Erro ao buscar versão do conteúdo:', error);
            res.status(500).json({ message: 'Erro ao buscar versão do conteúdo' });
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
            const content = await mongodb.collection('contentVersions').findOne({ contentID: parseInt(id) });
            
            if (!content) {
                return res.status(404).json({ message: 'Conteúdo não encontrado' });
            }
            
            const lastVersion = content.contentVersions.find((version: any) => version.id === content.lastVersion);
            lastVersion.title = content.title;

            const username = await pgdb.one('SELECT username FROM users WHERE id = $1', [content.userID]);

            lastVersion.username = username.username;
            lastVersion.lastVersion = content.lastVersion;
            lastVersion.isOwner = content.userID === req.body.user.id;
            
            res.status(200).json(lastVersion);
        } catch (error) {
            console.error('Erro ao buscar conteúdo:', error);
            res.status(500).json({ message: 'Erro ao buscar conteúdo' });
        }
    }

    public async getUserContentDetails(req: Request, res: Response): Promise<any | void> {
        const { username } = req.params;

        try {
            // Get user ID from username
            const user = await pgdb.oneOrNone('SELECT id FROM users WHERE username = $1', [username]);

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const userID = user.id;

            // Get contents for the user
            const contents = await pgdb.any('SELECT id, title FROM contents WHERE userID = $1', [userID]);

            const contentDetails = await Promise.all(contents.map(async (content: any) => {
                const contentVersions = await mongodb.collection('contentVersions').findOne({ contentID: content.id });
                const versionCount = contentVersions ? contentVersions.contentVersions.length : 0;

                const comments = await mongodb.collection('comments').find({ contentID: content.id.toString() }).toArray();
                const commentsCount = comments.length;

                return {
                    contentID: content.id,
                    username,
                    title: content.title,
                    versionCount,
                    commentsCount,
                };
            }));

            res.status(200).json(contentDetails);
        } catch (error) {
            console.error('Erro ao buscar detalhes dos conteúdos do usuário:', error);
            res.status(500).json({ message: 'Erro ao buscar detalhes dos conteúdos' });
        }
    }

    public async getAllContents(req: Request, res: Response): Promise<any | void> {
        const userID = req.body.user.id;
        
        try {
            const userEditorLevel = await pgdb.one('SELECT editorLevel FROM users WHERE id = $1', [userID]);

            const contents = await mongodb.collection('contentVersions').find().toArray();

            const contentDetails = await Promise.all(contents.map(async (content: any) => {
                const minEditorLevel = await pgdb.one('SELECT mineditorlevel FROM contents WHERE id = $1', [content.contentID]);

                if (userEditorLevel.editorLevel < minEditorLevel.mineditorlevel) {
                    return null;
                }

                const user = await pgdb.oneOrNone('SELECT username FROM users WHERE id = $1', [content.userID]);

                const versionCount = content.contentVersions.length;

                const comments = await mongodb.collection('comments').find({ contentID: content.contentID.toString() }).toArray();
                const commentsCount = comments.length;

                return {
                    contentID: content.contentID,
                    username: user.username,
                    title: content.title,
                    versionCount,
                    commentsCount,
                };
            }));

            const filteredContentDetails = contentDetails.filter(content => content !== null);
            filteredContentDetails.sort((a, b) => b.commentsCount - a.commentsCount);

            res.status(200).json(contentDetails);
        } catch (error) {
            console.error('Erro ao buscar todos os conteúdos:', error);
            res.status(500).json({ message: 'Erro ao buscar todos os conteúdos' });
        }
    }
}

export default new TextController();