import pgdb from '../config/postgresql';

class TextService {
    async atributePoints(text: string, userID: number) {
        const wordCount = text.split(' ').length;
        const points = Math.floor(wordCount / 10);

        await pgdb.query(`UPDATE users SET writingPoints = writingPoints + $1 WHERE id = $2`, [points, userID]);
    }
}

export default new TextService();