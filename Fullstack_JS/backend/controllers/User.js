import Users from "../models/UserModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}


//fungsi register
export const Register = async(req, res) => {
    const {name, email, password, confpassword} = req.body;
    if(password !== confpassword) return res.status(400).json({msg: "Password dan Confirm password tidak sama"});

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({msg: "Register Berhasil"});
    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Password Salah"});
        const userid = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userid, name, email}, process.env.ACCESS_TOKEN_SECRET,{
             expiresIn: "30s"
        });    

        const refreshToken = jwt.sign({userid, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: "1d"
          });

        await Users.update({refresh_token: refreshToken}, {
            where: {
                id: userid
            }
        });


        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({accessToken});

    } catch (error) {
        res.status(404).json({msg: "Email tidak ada"});
    }
}


export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(204);
        const userid = user[0].id;
        await Users.update({refreshToken: null}, {
            where: {
                id: userid
            }
        });
        res.clearCookie("refreshToken");
        return res.sendStatus(200);
}