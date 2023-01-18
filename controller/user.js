const db = require('../config/database');
const { generateToken } = require('../helper/jwt');

class UserController {
    static async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ message: 'Email and Password cannot empty!' });
        }

        try {
            let user = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
            if (user.rows.length == 0) {
                return res.status(404).json({ message: `User with email ${email} not found!` });
            }
            if (user.rows[0].password != password) {
                return res.status(400).json({ message: `Wrong password` });
            }
            let payload = {
                id: user.rows[0].id
            };
            const token = generateToken(payload);
            return res.status(201).json({ token });
        } catch (err) {
            return res.status(500).json(err.message);
        }
    };

    static async register(req, res) {
        const { email, password } = req.body;
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email || !password) {
            return res.status(401).json({ message: 'Email and Password cannot be empty!' });
        } else if (!email.match(mailFormat)) {
            return res.status(409).json({ message: `Email address invalid` });
        }

        try {
            const emailCheck = await db.query(
                `SELECT * FROM users WHERE email=$1`, [email]
            );
            if (emailCheck.rows.length > 0) {
                return res.status(409).json({ message: 'Email already exist' });
            }
            const result = await db.query(
                `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`, [
                email, password
            ]);
            return res.status(201).json(result.rows[0]);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    }
}

module.exports = UserController;