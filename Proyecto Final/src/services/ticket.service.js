import { TicketManagerMongo } from "../DAL/DAOs/ticketManagerMongo.js";

class TicketService {
    constructor() {
        this.ticketsManager = new TicketManagerMongo();
    }

    async createTickets(ticket) {
        try {
            const newTicket = await this.ticketsManager.createTicket(ticket);
            return newTicket;
        } catch (error) {
            return error;
        }
    };
};

export const ticketService = new TicketService();