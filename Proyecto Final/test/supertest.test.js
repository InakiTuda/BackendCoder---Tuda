import supertest from "supertest";
import { expect } from "chai";

const request = supertest("http://localhost:8080");

describe("Products endpoints", () => {
    describe("POST /api/products", () => {
        const product1 = {
            title: "Joystick DualSense",
            description: "Joystick DualSense",
            price: 95000,
            stock: 30,
            code: "PJ1234",
            category: "Accesorios",
        };
        it("should create a product with thumbnail property in false", async () => {
            const response = await request.post("/api/products").send(product1);
            //console.log(response);
            //expect(response.statusCode).to.be.equal(400);
            expect(response._body.payload.thumbnail).to.be.false;
        });
    });
});