import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};

export const verifyGroupToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;

        // Überprüfen, ob die groupId im Token mit der groupId im Anforderungskörper übereinstimmt
        const { groupId } = req.body;
        if (groupId && groupId !== req.user.groupId) {
            return res.status(403).json({ error: 'Access denied. Invalid groupId.' });
        }

        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

export const verifyTokenAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401).json({ "msg": "token null"});
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) { console.log(err); return res.sendStatus(403); }

        const user = await Users.findAll({
            where:{
                email: decoded.email
            }
        });
        const rank = user[0].rank;
        if(rank == 0) return res.sendStatus(401);
        next();
    })
}