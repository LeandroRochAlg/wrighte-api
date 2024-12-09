import { Request, Response } from 'express';
import pgdb from '../config/postgresql';
import bcrypt from 'bcrypt';

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

       // Atualizar Nome de Usuário e Email
       async updateUser(req: Request, res: Response) {
        const { id, name, email } = req.body;

        try {
            const user = await pgdb.oneOrNone(
                `UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email`,
                [name, email, id]
            );

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            res.status(200).json({ message: 'Perfil atualizado com sucesso', user });
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.status(500).json({ message: 'Erro interno ao atualizar perfil' });
        }
    }

    // Atualizar Senha
    async updatePassword(req: Request, res: Response) {
        const { id, currentPassword, newPassword } = req.body;

        try {
            // Verificar o usuário
            const user = await pgdb.oneOrNone(`SELECT password FROM users WHERE id = $1`, [id]);

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Verificar a senha atual
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Senha atual inválida' });
            }

            // Atualizar para a nova senha
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pgdb.none(`UPDATE users SET password = $1 WHERE id = $2`, [hashedPassword, id]);

            res.status(200).json({ message: 'Senha atualizada com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            res.status(500).json({ message: 'Erro interno ao atualizar senha' });
        }
    }
    
    async deleteUser(req: Request, res: Response) {
        const { id } = req.body;

        try {
            const user = await pgdb.oneOrNone(`DELETE FROM users WHERE id = $1 RETURNING id, username, email`, [id]);

            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }

            res.status(200).json({ message: 'Usuário deletado com sucesso', user });
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({ message: 'Erro interno ao deletar usuário' });
        }
    }
}

export default new UserController();