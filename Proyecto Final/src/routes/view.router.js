import {Router} from "express";
import ProductManager from "../DAL/DAOs/productManagerMongo.js";

const pm = new ProductManager();
const routerV = Router()

// Vista Home (/api/views)
routerV.get("/", async (req, res) => {
    try {
        const products = await pm.getProducts();
        res.render("products", {products})
    } catch (error) {
        res.status(500).json({error: "No se pudo cargar la lista de productos"});
    }
});

// Vista Products (/api/views/products)
routerV.get("/products", async (req, res) => {
    try {
        const products = await pm.getProducts();
        res.render("products", {products, user: req.session.passport.user});
    } catch (error) {
        res.status(500).json({error: "No se pudo cargar la lista de productos"});
    }
});

// Vista RealTimeProducts (/api/views/realtimeproducts)
routerV.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await pm.getProducts();
        res.render("realTimeProducts", {products});
    } catch (error) {
        res.status(500).json({error: "No se pudo cargar la lista de productos"});
    }
});

// Login, Register y Profile
const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect("/profile");
    next();
};

const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect("/login");
    next();
};

routerV.get("/register", publicAccess, (req, res) => {
    res.render("register")
});

routerV.get("/login", publicAccess, (req, res) => {
    res.render("login")
});

routerV.get("/profile", privateAccess, (req, res) => {
    res.render("profile", {
        user: req.session.user,
    })
});

export default routerV;