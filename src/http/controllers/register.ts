import { FastifyRequest, FastifyReply } from "fastify";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { registerUserCase } from "@/use-cases/register";

export async function register(request: FastifyRequest, reply: FastifyReply) {

    const createUserBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password } = createUserBodySchema.parse(request.body);

    const password_hash = await hash(password, 6);

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email
        }
    })

    try {

        await registerUserCase({ name, email, password })

    } catch (err) {
        return reply.status(409).send()
    }


    let user = await prisma.user.create({
        data: {
            name,
            email,
            password_hash: password_hash, // In a real application, you should hash the password before storing it
        }
    })

    return reply.status(201).send({
        message: 'User created successfully',
        user: user
    })

}