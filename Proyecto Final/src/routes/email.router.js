import {Router} from "express";
import { transporter } from "../nodemailer.js";

const routerE = Router();

routerE.get("/", async (req, res) => {
    const messageOpt = {
        from: "IñaShop",
        to: "reciever@sender.com",
        subject: "Compra IñaShop",
        html: "Gracias por tu compra!"
    };
    await transporter.sendMail(messageOpt);
    res.send("Mail enviado");
});

export default routerE;