import { Console } from "@prisma/client";
import prisma from "config/database";
import { faker } from "@faker-js/faker";


export async function createConsole () {
    return await prisma.console.create({
        data: {
            name: faker.vehicle.model()
        }
    })
}

export async function createFakeConsole () {
    return  {
           notname :faker.vehicle.model()
        }
    }
