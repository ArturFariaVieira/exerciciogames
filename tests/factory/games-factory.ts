import { Game } from "@prisma/client";
import prisma from "config/database";
import { faker } from "@faker-js/faker";


export async function createGame (consoleId: number) {
    return await prisma.game.create({
        data: {
            title: faker.vehicle.model(),
            consoleId: consoleId
        }
    })
}

export async function createFakeGameNoTitle (consoleId: number) {
    return  {
           notatitle :faker.vehicle.model(),
           consoleId: consoleId
        }
    }

    export async function createFakeGameNoConsoleId () {
        return  {
               title :faker.vehicle.model(),
               notaconsoleId: 3
            }
        }