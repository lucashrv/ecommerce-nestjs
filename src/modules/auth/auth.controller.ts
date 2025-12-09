import {
    Controller,
    Post,
    Body,
    Res,
    Req,
    Get,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { credentialsDto } from "./dto/credentials.dto";
import { UserDto } from "../user/dto/data-user.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./guards/auth.guard";
import {
    LoginAuthDocs,
    LogoutAllAuthDocs,
    LogoutAuthDocs,
    MeAuthDocs,
} from "src/swagger/auth.swagger";
import { Role, Roles } from "./decorators/roles.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @LoginAuthDocs()
    async login(
        @Body() body: credentialsDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginDto> {
        const login = await this.authService.login(body, req, res);

        return login;
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.CUSTOMER)
    @LogoutAuthDocs()
    @Post("logout")
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{
        message: string;
    }> {
        const sessionToken = req.cookies?.session as string;

        await this.authService.logout(sessionToken);

        res.clearCookie("session", { path: "/" });

        return { message: "Sessão encerrada" };
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.CUSTOMER)
    @LogoutAllAuthDocs()
    @Post("logout-all")
    async logoutAll(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{
        message: string;
    }> {
        const userId = req.user?.id as string;

        await this.authService.logoutAll(userId);

        res.clearCookie("session", { path: "/" });

        return { message: "Todas as sessões foram encerradas" };
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.CUSTOMER)
    @MeAuthDocs()
    @Get("me")
    me(@Req() req: Request): UserDto {
        const user = this.authService.me(req);

        return user;
    }
}
