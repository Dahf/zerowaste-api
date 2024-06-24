import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Group from "../models/Group.js";
import UserGroup from "../models/UserGroup.js";

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
            const [group, created] = await Group.findOrCreate({
                where: { name: "Group " + email }
              });
          
              // Füge den Benutzer der Gruppe hinzu
              await UserGroup.create({
                userId: user.id,
                groupId: group.id
              });

            res.json({msg: "Registration Successful"});
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(400).json({msg: "E-Mail already in use."});
    }
}
 
export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Wrong password" });
        }

        const { id, kndnr, email, rank, vorname, nachname, plz, ort, land, geburtstag, phone, anrede, straße, hausnummer, confirmed } = user;

        const accessToken = jwt.sign(
            { id, kndnr, email, rank, vorname, nachname, plz, ort, land, geburtstag, phone, anrede, straße, hausnummer, confirmed },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }  // Adjusted for practical use
        );

        const refreshToken = jwt.sign(
            { id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id
            }
        });

        res.cookie('refreshToken', refreshToken, {
            secure: true,
            httpOnly: true, 
            sameSite: 'None',
            path: "/",
            maxAge: 24 * 60 * 60 * 1000  // 1 day
        });
        
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.status(200).json({ user, accessToken });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Internal server error" });
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