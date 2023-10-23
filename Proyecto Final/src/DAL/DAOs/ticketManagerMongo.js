import ticketModel from "../mongoDB/models/ticket.model.js";

class TicketManagerMongo {
    async createTicket(ticket) {
        const newTicket = new ticketModel(ticket)
        await newTicket.save();
        return newTicket;
    }
};

export {TicketManagerMongo};