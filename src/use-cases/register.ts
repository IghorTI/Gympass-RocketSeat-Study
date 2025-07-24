import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";
// import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

interface RegisterUserCaseRequest {
    name: string;
    email: string;
    password: string
}

export class RegisterUseCase {

    constructor(private usersRepository : UsersRepository){

    }

    async execute({name,email,password}: RegisterUserCaseRequest) {

        const password_hash = await hash(password, 6);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new Error('User already exists with this email');
        }

        await this.usersRepository.create({
            name,
            email,
            password_hash: password_hash,
        });
    }

}


