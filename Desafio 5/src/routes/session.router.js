import { Router } from "express";
import userModel from "../dao/mongo/user.js";

const router = Router();

router.post("/register", async (req, res) => {
    const result = await userModel.create(req.body);
    res.send({status: "success", payload: result})
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    // Primero buscar si existe el usuario
    const user = await userModel.findOne({email, password});
    if (!user) return res.status(400).send({status: "error", error: "Usuario o Contraseña incorrectas"});
    // Si existe el usuario, iniciar sesión
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email
    }
    res.sendStatus(200);
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/login');
    })
})

export default router;