import Router from "express";
import userModel from "../db/models/user.model.js";
import {compareData, hashData} from "../utils.js";
import passport from "passport";
import { getUsers, createUser } from "../controllers/users.controller.js";

const routerS = Router();

routerS.post("/register", async(req, res) => {
  const {first_name, last_name, username, email, password} = req.body;
  // Hash Password
  const hashPassword = await hashData(password);
  const exist = await userModel.findOne({email});
  if (exist) {
    return res.status(400).send({ status: "error", error: "El usuario ya existe" });
  }
  const user = {
    first_name, last_name, email, password: hashPassword
  };
  const result = await userModel.create(user);
  res.send({status: "success", message: "Usuario registrado correctamente"});
});

routerS.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // ¿Existe el usuario?
    /* const user = await userModel.findOne({email, passoword}) */
    const user = await userModel.findOne({email});
    if (!user)
    return res.status(400).send({ 
        status: "error", 
        error: "Datos Incorrectos",
    });
    // Si existe el usuario, comparar la contraseña hasheada
    const isPasswordValid = await compareData(password, user.password);
    /* console.log(isPasswordValid); */
    if (!isPasswordValid) {
        return res.status(401).json({message: "Usuario o Contraseña incorrectas"});
    }
    // Si al comparar las contraseñas es válida, crearle una sesión y mandarle estas propiedades a Profile
    req.session.passport = {
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            _id: user._id,
            email: user.email,
            username: user.username,
        }
    };
    if (!user) {
      return res.status(400).send({status: "error", error: "Datos Incorrectos"})
    }
    // Validacion para ADMIN
    if(email === "adminCoder@coder.com" && password === "adminCod3r123") {
      user.role = "ADMIN";
    }
    req.session.passport.user = {
      _id: user._id,
      name: `${user.first_name}${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
      }
      res.redirect('/api/views');
});

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

// Ruta Current
routerS.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({user: req.user});
  } else {
    res.status(401).json({error: "Usuario no autenticado"});
  }
});

routerS.get("/", getUsers);
routerS.post("/", createUser);

export default routerS;