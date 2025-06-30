import fastify from 'fastify';
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient();

prisma.user.create({
    "name": "Ighor Rodrigues",
    "email": 'ighorrc@gmail.com'
})


export const app = fastify();