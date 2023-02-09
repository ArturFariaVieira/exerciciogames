import app from "app";
import  prisma from "config/database";
import supertest from "supertest"
import { faker } from "@faker-js/faker";
import { createConsole, createFakeConsole } from "../factory/console-factory";
import httpStatus from "http-status";



beforeAll(async () => {
    await prisma.game.deleteMany({});
    await  prisma.console.deleteMany({})
  });
  afterAll(async () => {
    await prisma.game.deleteMany({});
    await  prisma.console.deleteMany({})
  });

const server = supertest(app)

describe("GET /consoles", () => {
    it("should respond with empty list if no consoles found", async () => {
        const response = await server.get("/consoles")
        expect(response.body).toEqual([])
    })

    it("should respond with list of object consoles", async () => {
        await createConsole();
        const response = await server.get("/consoles")
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String)
                })
            ])
        )
    })

    

    
})

describe("GET /consoles/:id" ,  () => {
    it ("should respond with 404 if provided Id is invalid", async() => {
        const newconsole = await createConsole();

        const response = await server.get(`/consoles/9999`);

        expect(response.status).toBe(httpStatus.NOT_FOUND)

        
    })

    it ("should respond with specific console if provided Id is valid", async() => {
        const newconsole = await createConsole();

        const response = await server.get(`/consoles/${newconsole.id}`);

        expect(response.body).toEqual(newconsole)

        
    })
})

describe("POST /consoles", () => {
    it("should respond with 422 if invalid body ", async() => {
        const invalidconsole = await createFakeConsole();
        const response = await server.post("/consoles").send(invalidconsole)

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })

    it ("should respond with 409 if console already created", async () => {
        const newconsole = await createConsole();

        const response = await server.post("/consoles").send({name: newconsole.name})

        expect(response.status).toBe(httpStatus.CONFLICT)
    })

    it ("should respond with 201 if console created", async () => {
        const response = await server.post("/consoles").send({
            name: faker.vehicle.model()
        })
            

        expect(response.status).toBe(201)
    })
})