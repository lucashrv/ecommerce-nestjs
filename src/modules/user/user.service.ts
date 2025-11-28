import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { DataUserDto } from "./dto/data-user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create(body: CreateUserDto): Promise<DataUserDto> {
        const { name, email, password, confirmPassword } = body;

        const userEmail = await this.prisma.user.findUnique({
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
            omit: {
                password: true,
            },
        });
        return newUser;
    }

    async findAll(): Promise<DataUserDto[]> {
        const users = await this.prisma.user.findMany({
            omit: {
                password: true,
            },
        });

        return users;
    }

    async findOne(id: number): Promise<DataUserDto> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            omit: { password: true },
        });

        if (!user) throw new NotFoundException("Usuário não encontrado");

        return user;
    }
}
