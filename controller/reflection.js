const db = require('../config/database');

class ReflectionController {
    static async createReflection(req, res) {
        const { success, low_point, take_away } = req.body;
        if (!success || !low_point || !take_away) {
            return res.status(401).json({ message: 'There is an empty field' });
        }
        const loggedUser = res.locals.user;
        try {
            const result = await db.query(
                'INSERT INTO reflections (success, low_point, take_away, owner_id, created_date, modified_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
                [
                    success,
                    low_point,
                    take_away,
                    loggedUser.id,
                    new Date(),
                    new Date()
                ]
            );
            return res.status(201).json(result.rows[0]);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    };

    static async getReflections(req, res) {
        const loggedUser = res.locals.user;
        try {
            const result = await db.query(
                `SELECT * FROM reflections WHERE owner_id=$1`,
                [parseInt(loggedUser.id)]
            );
            return res.status(200).json(result.rows);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    };

    static async updateReflections(req, res) {
        const reflectionId = +req.params.reflectionId;
        const { success, low_point, take_away } = req.body;
        if (!success || !low_point || !take_away) {
            return res.status(401).json({ message: 'There is an empty field' });
        }

        try {
            const result = await db.query(
                'UPDATE reflections SET success=$1, low_point=$2, take_away=$3, modified_date=$4 WHERE id=$5',
                [
                    success,
                    low_point,
                    take_away,
                    new Date(),
                    parseInt(reflectionId)
                ]
            );
            console.log(result);
            return res.status(200).json({ message: 'Reflection Updated'});
        } catch (err) {
            return res.status(500).json(err.message);
        }
    }
    static async deleteReflection(req, res) {
        const reflectionId = +req.params.reflectionId;
        try {
            const result = await db.query(`DELETE FROM reflections WHERE id=$1`, [parseInt(reflectionId)]);
            return res.status(200).json({ message: 'Reflection deleted' });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    }
};

module.exports = ReflectionController;