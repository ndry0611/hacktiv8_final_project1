const db = require('../config/database');

async function authorization(req, res, next) {
    const reflectionId = +req.params.reflectionId;
    const loggedUser = res.locals.user;
    if (isNaN(reflectionId)) return res.status(422).json({ message: 'Reflection ID must be an integer' });
    try {
        const reflection = await db.query(
            'SELECT * FROM reflections where id = $1', [parseInt(reflectionId)]
        );
        if (reflection.rows.length == 0) {
            return res.status(404).json({ message: `Reflections ID : ${reflectionId} not found` });
        }
        if (reflection.rows[0].owner_id !== loggedUser.id) {
            return res.status(403).json({ message: `You don't have permission to access reflection with id : ${reflectionId}` });
        }
        return next();
    } catch (err) {
        return res.status(500).json(err.message);
    }
}

module.exports = authorization;