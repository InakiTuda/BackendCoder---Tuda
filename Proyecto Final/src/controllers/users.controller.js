import { getAll, create } from "../services/users.service.js";

export const getUsers = (req, res) => {
    const users = getAll()
    res.status(200).json({users})
};

export const createUser = async (req, res) => {
    const {first_name, last_name, email, password} = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({message: "Falta información para crear el usuario"});
    }
    const newUser = create(req.body);
    res.status(200).json({user: newUser});
};