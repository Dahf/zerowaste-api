import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.email = decoded.email;
        next();
    })
}

export const verifyTokenAdmin = (req, res, next) => {
    const authHeader = req.cookies.accessToken;
    if (!authHeader) {
        console.error("Authorization header is missing");
        return res.status(401).send("Authorization header is missing");
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.error("Token not found in authorization header");
        return res.status(401).send("Token not found in authorization header");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).send("Invalid token");
        }

        try {
            const users = await Users.findAll({
                where: {
                    email: decoded.email
                }
            });
            
            if (!users || users.length === 0) {
                console.error("User not found with email:", decoded.email);
                return res.status(404).send("User not found");
            }

            const user = users[0];
            if (user.rank !== 0) {
                console.error("Unauthorized access attempt by user:", user.email);
                return res.status(401).send("Unauthorized");
            }
            
            next();
        } catch (dbError) {
            console.error("Database error:", dbError);
            return res.status(500).send("Database error");
        }
    });
}