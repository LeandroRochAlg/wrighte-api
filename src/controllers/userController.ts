import { Request, Response } from 'express';
import pgdb from '../config/postgresql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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

    async updateUser(req: Request, res: Response) {
        const { name, email } = req.body;
        const userId = req.body.user.id; // ID obtido do token (certifique-se de que o middleware de autenticação está funcionando)
    
        // Validação de entrada
        if (!name || !email) {
            res.status(400).json({ message: 'Nome e email são obrigatórios' });
        }
    
        try {
            // Atualiza os dados do usuário
            const user = await pgdb.oneOrNone(
                `UPDATE users 
                 SET username = $1, email = $2 
                 WHERE id = $3 
                 RETURNING id, username, email`,
                [name, email, userId]
            );
    
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }
    
            res.status(200).json({ message: 'Perfil atualizado com sucesso', user });
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.status(500).json({ message: 'Erro interno ao atualizar perfil' });
        }
    }
    // Atualizar Senha
    async updatePassword(req: Request, res: Response) {
        const { currentPassword, newPassword } = req.body;
        const userId = req.body.user.id; // ID obtido do token (certifique-se de que o middleware de autenticação está funcionando)

        try {
            // Verificar o usuário
            const user = await pgdb.oneOrNone(`SELECT password FROM users WHERE id = $1`, [userId]);

            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Verificar a senha atual
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: 'Senha atual inválida' });
            }

            // Atualizar para a nova senha
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pgdb.none(`UPDATE users SET password = $1 WHERE id = $2`, [hashedPassword, userId]);

            res.status(200).json({ message: 'Senha atualizada com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            res.status(500).json({ message: 'Erro interno ao atualizar senha' });
        }
    }

}

export default new UserController();