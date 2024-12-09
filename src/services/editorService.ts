import pgdb from '../config/postgresql';

class EditorService {
    async addXp(userID: number){
        await pgdb.query(`UPDATE users SET editorXp = editorXp + $1 WHERE id = $2`, [1, userID]);

        const levelXp = await pgdb.one('SELECT editorLevel, editorXp FROM users WHERE id = $1', [userID]);

        if(levelXp.editorxp >= levelXp.editorlevel * 5){
            const rest = levelXp.editorxp - levelXp.editorlevel * 5;
            await pgdb.query(`UPDATE users SET editorXp = $1 WHERE id = $2`, [rest, userID]);
            await pgdb.query(`UPDATE users SET editorLevel = editorLevel + $1 WHERE id = $2`, [1, userID]);
        }
    }
}

export default new EditorService();