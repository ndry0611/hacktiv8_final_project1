const db = require('../config/database');
const { verifyToken } = require('../helper/jwt');

async function authentication(req, res, next) {
    try {
        const token = req.get('x-access-token');
        const userDecoded = verifyToken(token);
        const dataUser = await db.query(`SELECT id, email FROM users WHERE id=$1`, [
            parseInt(userDecoded.id)
        ]);
        if (dataUser.rows.length == 0) {
            return res.status(401).json({ message: `User not found!` });
        }
        res.locals.user = dataUser.rows[0];
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Need to login first' });
    }
}

module.exports = authentication;