import {
    NotFoundException,
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { credentialsDto } from "./dto/credentials.dto";
import { DataUserDto } from "../user/dto/data-user.dto";
import { LoginDto } from "./dto/login.dto";
import { Request, Response } from "express";

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async login(
        body: credentialsDto,
        req: Request,
        res: Response,
    ): Promise<LoginDto> {
        const { email, password } = body;

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new BadRequestException("E-mail ou senha incorretos");

        if (!user.is_active)
            throw new UnauthorizedException("Usuário desativado");

        const comparePass = bcrypt.compareSync(password, user.password);
        if (!comparePass)
            throw new BadRequestException("E-mail ou senha incorretos");

        const sessionToken = randomUUID();
        const expires = add(new Date(), { days: 7 });
        const session = await this.prisma.session.create({
            data: {
                sessionToken,
                userId: user.id,
                expires,
                userAgent: req.headers["user-agent"] as string,
                ipAddress: req.ip as string,
            },
            select: { sessionToken: true, expires: true },
        });

        res.cookie("session", sessionToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            expires,
        });

        return {
            sessionId: session.sessionToken,
            user: { id: user.id, email: user.email, name: user.name },
        };
    }

    async logout(sessionToken: string): Promise<void> {
        if (!sessionToken)
            throw new NotFoundException(
                "Sessão não encontrada ou não existente",
            );

        await this.prisma.session.updateMany({
            where: { sessionToken },
            data: { revoked: true },
        });
    }

    async logoutAll(userId: string): Promise<void> {
        await this.prisma.session.updateMany({
            where: { userId },
            data: { revoked: true },
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
