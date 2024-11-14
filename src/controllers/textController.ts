import { Request, Response } from 'express';
import pgdb from '../config/postgresql';
import { mongodb } from '../config/mongodb';
import { ObjectId } from 'mongodb';

class TextController {
    public async saveContent(req: Request, res: Response): Promise<any | void> {
        const { title, content } = req.body;

        const contentVersionsCollection = mongodb.collection('contentVersions');

        try {
            // Insira o título, conteúdo e userID no banco de dados
            const contentID = await pgdb.one('INSERT INTO contents(title, userID) VALUES($1, $2) RETURNING id', [title, req.body.user.id]);

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
            
            res.status(200).json(lastVersion);
        } catch (error) {
            console.error('Erro ao buscar conteúdo:', error);
            res.status(500).json({ message: 'Erro ao buscar conteúdo' });
        }
    }
}

export default new TextController();