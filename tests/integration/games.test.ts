import app from "app";
import  prisma from "config/database";
import supertest from "supertest"
import { faker } from "@faker-js/faker";
import { createConsole, createFakeConsole } from "../factory/console-factory";
import httpStatus from "http-status";
import { createFakeGameNoConsoleId, createFakeGameNoTitle, createGame } from "../factory/games-factory";



beforeAll(async () => {
    await prisma.game.deleteMany({});
    await  prisma.console.deleteMany({})
  });
  afterAll(async () => {
    await prisma.game.deleteMany({});
    await  prisma.console.deleteMany({})
  });

const server = supertest(app)


describe("GET /games", () => {
    it("should respond with empty list if no games found", async () => {
        const response = await server.get("/games")
        expect(response.body).toEqual([])
    })

    it("should respond with list of object games", async () => {
        const console = await createConsole();
        const game = await createGame(console.id)
        


        const response = await server.get("/games")
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    title: expect.any(String),
                    Console: expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String)
                    })
                })
            ])
        )
    })     
})

describe("GET /games/:id", () => {
    it ("should respond with 404 if provided Id is invalid", async() => {

        const response = await server.get(`/games/9999`);

        expect(response.status).toBe(httpStatus.NOT_FOUND)

        
    })

    it ("should respond with specific game if provided Id is valid", async() => {
        const console1 = await createConsole();
        const game = await createGame(console1.id)

        const response = await server.get(`/games/${game.id}`);
        console.log(response.body)
        

        expect(response.body).toEqual(expect.objectContaining({
            id: game.id,
            title: game.title,
            Console: expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String)
            })
        }))

        
    })   
})

describe("POST /games", () => {
    it("should respond with 422 if title not provided ", async() => {
        const console = await createConsole();
        const fakegame = await createFakeGameNoTitle(console.id)
        const response = await server.post("/games").send(fakegame)
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })
    
    it("should respond with 422 if consoleId not provided ", async() => {
        const console = await createConsole();
        const fakegame = await createFakeGameNoConsoleId()
        const response = await server.post("/games").send(fakegame)
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })


    it ("should respond with 409 if game already created", async () => {
        const newconsole = await createConsole();
        const game = await createGame(newconsole.id)

        const response = await server.post("/games").send({title: game.title, consoleId: newconsole.id})

        expect(response.status).toBe(httpStatus.CONFLICT)
    })

    it ("should respond with 201 if game created", async () => {
        const newconsole = await createConsole();
        
        const response = await server.post("/games").send({
            title: faker.vehicle.model(),
            consoleId: newconsole.id
        })
            

        expect(response.status).toBe(201)
    })
})