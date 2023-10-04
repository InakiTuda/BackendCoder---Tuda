import { usersManager } from "../DAL/userManagerMongo.js";

export const getAll = () => {
    const users = usersManager.findAll();
    return users;
};

export const create = (obj) => {
    // Hash Password
    const response = usersManager.create(obj);
};