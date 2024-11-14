import { Request, Response } from 'express';
import pgdb from '../config/postgresql';

class UserController {
    async getUsers(_req: Request, res: Response) {
        try{
            const users = await pgdb.manyOrNone("SELECT * FROM users");
            res.status(200).json(users);
        } catch(error){
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({ message: 'Erro ao buscar usuários' });
        }
    }
}

export default new UserController();