import {ticketService} from "../services/ticket.service.js";
import {generateUniqueCode} from "../codeGenerator.js";

class TicketController {
    async createTicket(req, res) {
        const {code, purchase_datetime, amount, purchaser} = req.body;
        try {
            const code = generateUniqueCode();
            const ticket = await ticketService.createTicket({
                code,
                purchase_datetime,
                amount,
                purchaser,
            });
            res.status(200).json({ticket})
        } catch (error) {
            return res.status(300).send({status: "error"});
        }
    };
};

export const ticketController = new TicketController();