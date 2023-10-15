import messageModel from "../mongoDB/models/messages.model.js";

export default class MessagesManager {
    getMessages = async() => {
        try {
            return await messageModel.find().lean().exec();
        } catch (error) {
            return error;
        }
    };

    createMessage = async (message) => {
        if (message.user.trim() === "" || message.message.trim() === "") {
            return null;
        }
        try {
            return await messageModel.create(message);
        } catch (error) {
            return error;
        }
    };

    deleteMessages = async () => {
        try {
            console.log("Borrando todos los mensajes...");
            const result = await messageModel.deleteMany({});
            console.log("Mensajes eliminados:", result);
            return result;
        } catch (error) {
            console.error("Error eliminando los mensajes:", error);
            return error;
        }
    };
};
