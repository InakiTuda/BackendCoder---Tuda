import Router from "express";
import userModel from "../dao/models/user.model.js";
import {hashData} from "../utils.js";
import passport from "passport";

const routerS = Router();

routerS.post("/register", async(req, res) => {
    const {first_name, last_name, email, password} = req.body;
    // Hash Password
    const hashPassword = await hashData(password);
    const exist = await userModel.findOne({email});
    if (exist) {
        return res.status(400).send({status: "error", error: "El usuario ya está registrado"});
    }
    const user = {
        first_name, last_name, email, password: hashPassword
    };
    const result = await userModel.create(user);
    res.send({status: "success", message: "Usuario registrado correctamente"});
});

routerS.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({email})
    if (!user) {
    return res.status(400).send({ status: "error", error: "Datos Incorrectos"})
    }
    // Validation for ADMIN user as specified in the deliverable slides
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    user.role = 'ADMIN';
    }
    req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role, // Adding user role to the session
    }
    res.redirect('/api/views');
})

routerS.get("/logout", (req, res) => {
    req.session.destroy(err  => {
        if(err) return res.status(500).send({status: "error", error: "No se pudo cerrar la sesión"});
        res.redirect("/login")
    });
});

// Github
routerS.get("/github", passport.authenticate("github", {scope: ["user: email"]}))

routerS.get('/githubcallback', passport.authenticate('github',{failureRedirect: '/login', successRedirect: '/profile'}), async (req, res)=>
{
    req.session.user = req.user
    res.redirect('/profile')
})

export default routerS;