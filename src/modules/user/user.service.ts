import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService extends PrismaClient {
    async create(body: CreateUserDto) {
        const { name, email, password, confirmPassword } = body;

        const userEmail = await this.user.findFirst({
            where: { email },
        });

        if (userEmail) {
            throw new BadRequestException("Email já cadastrado");
        }

        if (password !== confirmPassword) {
            throw new BadRequestException("Senhas não correspondem");
        }

        const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT));
        const hash = bcrypt.hashSync(password, salt);

        const newUser = await this.user.create({
            data: {
                name,
                email,
                password: hash,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        return newUser;
    }

    findAll() {
        return `This action returns all user`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
