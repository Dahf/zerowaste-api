import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
 
export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const kndnr = user[0].kndnr;
            const userId = user[0].id;
            const email = user[0].email;
            const rank = user[0].rank;
            const vorname = user[0].vorname;
            const nachname = user[0].nachname;
            const plz = user[0].plz;
            const ort = user[0].ort;
            const land = user[0].land;
            const geburtstag = user[0].geburtstag;
            const phone = user[0].phone;
            const anrede = user[0].anrede; 
            const straße = user[0].straße;
            const hausnummer = user[0].hausnummer;
            const confirmed = user[0].confirmed;
            const accessToken = jwt.sign({userId, kndnr, vorname, nachname, plz, ort, land, geburtstag, phone, anrede, straße, hausnummer, email, rank, confirmed}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15s'
            });
            
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}