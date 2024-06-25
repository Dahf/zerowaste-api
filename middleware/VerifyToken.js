import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";
import UserGroup from "../models/UserGroup.js";

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


export const verifyGroupToken = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;

        // Überprüfen, ob die groupId im Anforderungskörper angegeben ist
        const { groupId } = req.body;
        if (!groupId) {
            return res.status(400).json({ error: 'groupId must be provided.' });
        }

        // Überprüfen, ob der Benutzer Mitglied der angegebenen Gruppe ist
        const userGroup = await UserGroup.findOne({
            where: {
                userId: req.user.id,
                groupId: groupId
            }
        });

        if (!userGroup) {
            return res.status(403).json({ error: 'Access denied. User is not a member of the specified group.' });
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