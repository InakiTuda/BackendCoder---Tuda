import { usersManager } from "../DAL/DAOs/userManagerMongo.js";
import UsersDto from "../DAL/DTOs/users.dto.js";
import { hashData } from "../utils.js";

class UserService {
    async findAll() {
        const response = await usersManager.findAll();
        return response
    };

    async findOne(id) {
        const response = await usersManager.findUserById(id);
        if(!response) {
            throw new Error("Usuario no encontrado")
        }
        return response
    };

    async createOne(obj) {
        const hashPassword = hashData(obj.password);
        if(!hashPassword) throw new Error("Contraseña no puede ser guardada");
        const userDTO = new UsersDto({...obj, password: hashPassword});
        const response = await usersManager.createOne(userDTO);
        return response;
    };

    async deleteOne(id) {
        const response = await usersManager.deleteOne(id);
        return response;
    };
};

export const usersService = new UserService();