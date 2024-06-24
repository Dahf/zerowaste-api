import Group from "../models/Group.js";
import UserGroup from "../models/UserGroup.js";
import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
 
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            console.log("Refresh token not found in cookies");
            return res.sendStatus(401); // Unauthorized
        }

        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) {
            console.log("No user found with the provided refresh token");
            return res.sendStatus(403); // Forbidden
        }

        const userGroup = await UserGroup.findOne({
            where: {
                userId: user.id
            }
        });

        if (!userGroup) {
            console.log("No group found for the user");
            return res.sendStatus(403); // Forbidden
        }

        const group = await Group.findOne({
            where: {
                id: userGroup.groupId
            }
        });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log("Failed to verify refresh token:", err);
                return res.sendStatus(403); // Forbidden
            }

            const {
                kndnr, id: userId, email, rank, vorname, nachname,
                plz, ort, land, geburtstag, phone, anrede, straße,
                hausnummer, confirmed
            } = user;

            const accessToken = jwt.sign(
                { userId, kndnr, email, rank, vorname, nachname, plz, ort, land, geburtstag, phone, anrede, straße, hausnummer, confirmed },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' } // Adjusted from 15s for practical use
            );
            
            res.setHeader('Authorization', `Bearer ${accessToken}`);
            res.json({ user, accessToken, group });
        });
    } catch (error) {
        console.error("Error in refreshToken function:", error);
        res.status(500).send("Internal Server Error");
    }
}