import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request & { user?: any } = context
            .switchToHttp()
            .getRequest();
        const token = req.cookies?.session as string;

        if (!token) throw new UnauthorizedException("Não autenticado");

        const session = await this.prisma.session.findUnique({
            where: { sessionToken: token },
            include: { user: true },
        });

        if (!session) throw new UnauthorizedException("Sessão inválida");
        if (session.revoked) throw new UnauthorizedException("Sessão revogada");
        if (session.expires < new Date())
            throw new UnauthorizedException("Sessão expirada");
        if (!session?.user.is_active)
            throw new UnauthorizedException("Usuário desabilitado");

        req.user = session.user;

        return true;
    }
}
