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
import { UserDto } from "../user/dto/data-user.dto";
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
        await this.prisma.session.create({
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

        req.user = { ...user, password: "" };

        return {
            message: "Usuário logado com sucesso",
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

    me(req: Request): UserDto {
        const user = req.user;

        if (!user) throw new NotFoundException("Usuário não encontrado");

        return user;
    }
}
