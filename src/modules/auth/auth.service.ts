import {
    NotFoundException,
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { add } from "date-fns";
import { credentialsDto } from "./dto/credentials.dto";
import { DataUserDto } from "../user/dto/data-user.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async login({ email, password }: credentialsDto): Promise<LoginDto> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new BadRequestException("E-mail ou senha incorretos");

        const comparePass = bcrypt.compareSync(password, user.password);
        if (!comparePass)
            throw new BadRequestException("E-mail ou senha incorretos");

        const sessionToken = randomBytes(32).toString("hex");
        const expires = add(new Date(), { days: 7 });
        const session = await this.prisma.session.create({
            data: { sessionToken, userId: user.id, expires },
            select: { sessionToken: true, expires: true },
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...safeUser } = user;

        return {
            sessionToken: session.sessionToken,
            expires: session.expires,
            user: safeUser,
        };
    }

    async logout(sessionToken: string): Promise<void> {
        if (!sessionToken)
            throw new NotFoundException(
                "Sessão não encontrada ou não existente",
            );

        await this.prisma.session.delete({
            where: { sessionToken },
        });
    }

    async me(sessionToken: string): Promise<DataUserDto> {
        if (!sessionToken)
            throw new NotFoundException(
                "Sessão não encontrada ou não existente",
            );

        const session = await this.prisma.session.findUnique({
            where: { sessionToken },
            include: { user: true },
        });

        if (!session || !session.user)
            throw new UnauthorizedException("Sessão inválida");

        if (session.expires < new Date()) {
            await this.prisma.session.delete({ where: { sessionToken } });
            throw new UnauthorizedException(
                "Sessão expirada, efetue o login novamente",
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...safeUser } = session.user;

        return safeUser;
    }
}
