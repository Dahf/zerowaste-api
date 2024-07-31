import Group from "../models/Group.js";
import UserGroup from "../models/UserGroup.js";
import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
 
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            console.log("Refresh token not found in cookies");
            return res.status(401).send("Refresh token not found in cookies"); // Unauthorized
        }

        console.log('Cookie: ' + refreshToken);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                console.log("Failed to verify refresh token:", err);
                return res.status(403).send('Failed to verify refresh token' + err); // Forbidden
            }
            const user = await Users.findOne({
                where: {
                    id: decoded.id
                }
            });
    
            if (!user) {
                console.log("No user found with the provided refresh token");
                return res.status(403).send('No user found with the provided refresh token'); // Forbidden
            }
    
            const userGroup = await UserGroup.findOne({
                where: {
                    userId: user.id
                }
            });
    
            if (!userGroup) {
                console.log("No group found for the user");
                return res.status(403).send('No group found for the user'); // Forbidden
            }
    
            const group = await Group.findOne({
                where: {
                    id: userGroup.groupId
                },
                include: [{
                    model: Users,
                    through: { attributes: [] } // Verhindert, dass die Zwischentabelle in den Ergebnissen angezeigt wird
                }]
            });

            const {
                kndnr, id , email, rank, vorname, nachname,
                plz, ort, land, geburtstag, phone, anrede, straße,
                hausnummer, confirmed
            } = user;

            const accessToken = jwt.sign(
                { id, kndnr, email, rank, vorname, nachname, plz, ort, land, geburtstag, phone, anrede, straße, hausnummer, confirmed },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' } // Adjusted for practical use
            );
            
            return res.json({ user, accessToken, refreshToken, group });
        });
    } catch (error) {
        console.error("Error in refreshToken function:", error);
        res.status(500).send("Internal Server Error");
    }
}