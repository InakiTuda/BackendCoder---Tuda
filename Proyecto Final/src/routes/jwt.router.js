import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import {usersManager} from "../dao/mongomanagers/userManagerMongo.js";
import { compareData, generateToken } from "../utils.js";

const routerJ = Router();

routerJ.post("/", async (req, res) => {
    //console.log("prueba")
    const {email, password} = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({message: "No se puede iniciar sesión"});
        }
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({message: "Usuario no existe. Registrarse"});
        }
        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Usuario o contraseña incorrectas"});
        }
        //console.log("isPassword", isPasswordValid);
        const token = generateToken(user)
        console.log("token", token)
            return res.status(200).json({message: "Se generó el token: ", token});
    } catch (error) {
        res.status(500).json({message: error});
    }
});

export default routerJ