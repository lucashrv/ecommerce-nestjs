import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async create(body: CreateUserDto) {
        const { name, email, password, confirmPassword } = body;

        const userEmail = await this.prisma.user.findFirst({
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

        const newUser = await this.prisma.user.create({
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

    async findAll() {
        const users = await this.prisma.user.findMany({
            omit: {
                password: true,
            },
        });

        return users;
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            omit: { password: true },
        });

        return user;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
