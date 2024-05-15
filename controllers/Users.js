import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id', 'kndnr', 'anrede', 'vorname', 'nachname', 'straße', 'hausnummer', 'plz', 'ort', 'land', 'geburtstag', 'phone', 'email', 'rank', 'createdAt', 'password', 'confirmed',]
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}
export const getUser = async (req, res) => {
    try {
        const rchilds = await Users.findAll({
            attributes:['id', 'kndnr', 'anrede', 'vorname', 'nachname', 'straße', 'hausnummer', 'plz', 'ort', 'land', 'geburtstag', 'phone', 'email', 'rank', 'createdAt', 'password', 'confirmed',],
            where: {
                id: req.params.id
            }
        });
        res.json(rchilds[0]);
    } catch (error) {
        console.log(error);
    }
}
export const deleteUser = async (req, res) => {
    try {
        await Users.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json("User deleted");
    } catch (error) {
        console.log(error);
    }
}
export const updateUser = async (req, res) => {
    const { kndnr, vorname, nachname, email, anrede, straße, hausnummer, plz, ort, land, geburtstag, phone, password, rank, confirmed } = req.body;
    try {
        if (password != "") {
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            
            await Users.update({anrede: anrede, kndnr: kndnr, vorname: vorname, nachname: nachname, plz: plz, ort: ort, land:land, geburtstag: geburtstag, phone: phone, anrede: anrede, straße: straße, hausnummer: hausnummer, email: email, password: hashPassword, rank: rank, confirmed},{
                where:{
                    id: req.params.id
                }
            });
        } else {
            await Users.update({anrede: anrede, kndnr: kndnr, vorname: vorname, nachname: nachname, plz: plz, ort: ort, land:land, geburtstag: geburtstag, phone: phone, anrede: anrede, straße: straße, hausnummer: hausnummer, email: email, rank: rank, confirmed},{
                where:{
                    id: req.params.id
                }
            });
        }

        res.json("User updated");
    } catch (error) {
        console.log(error);
    }
}
export const Register = async(req, res) => {
    const { vorname, nachname, plz, ort, land, geburtstag, phone, anrede, straße, hausnummer, email, password } = req.body;
    
    const user = await Users.findAll({
        where:{
            email: email
        }
    });
    if(user.length == 0){
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        try {
            await Users.create({
                vorname: vorname,
                nachname: nachname,
                plz: plz,
                ort: ort,
                land: land,
                geburtstag: geburtstag,
                phone: phone,
                anrede: anrede,
                straße: straße,
                hausnummer: hausnummer,
                email: email,
                password: hashPassword,
                rank: '0',
                kndnr: 0,
                confirmed: false,
            });
            res.json({msg: "Registration Successful"});
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(400).json({msg: "E-Mail already in use."});
    }
}
 
export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        if (user.length === 0) {
            return res.status(404).json({ msg: "User not found" });
        }
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const kndnr = user[0].kndnr;
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
        const accessToken = jwt.sign({kndnr, userId, vorname, nachname, plz, ort, land, geburtstag, phone, anrede, straße, hausnummer, email, rank, confirmed}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({kndnr, userId, vorname, nachname, plz, ort, land, geburtstag, phone, anrede, straße, hausnummer, email, rank, confirmed}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            secure: true,
            httpOnly: true, 
            sameSite: 'None',
            path: "/",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json(accessToken);
    } catch (error) {
        res.status(404).json({msg: error});
    }
}
 
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}