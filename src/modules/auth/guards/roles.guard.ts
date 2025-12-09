import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) return true;

        const req: Request = context.switchToHttp().getRequest();
        let user = req.user;

        if (!user) {
            const token = req.cookies?.session as string;
            if (!token) throw new UnauthorizedException("Não autenticado");

            const session = await this.prisma.session.findUnique({
                where: { sessionToken: token },
                include: { user: true },
            });

            if (!session) {
                throw new ForbiddenException("Sessão inválida");
            }

            user = { ...session.user, password: "" };

            req.user = user;
        }

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException("Usuário não possui permissão");
        }

        return true;
    }
}
