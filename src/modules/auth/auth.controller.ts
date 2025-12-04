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
import { AuthGuard } from "./auth.guard";
import {
    LoginAuthDocs,
    LogoutAllAuthDocs,
    LogoutAuthDocs,
    MeAuthDocs,
} from "src/swagger/auth.swagger";

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

    @Post("logout")
    @UseGuards(AuthGuard)
    @LogoutAuthDocs()
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

    @Post("logout-all")
    @UseGuards(AuthGuard)
    @LogoutAllAuthDocs()
    async logoutAll(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{
        message: string;
    }> {
        const userId = req.user?.id as string;

        await this.authService.logoutAll(userId);

        res.clearCookie("session", { path: "/" });

        return { message: "Todas as sessões encerradas" };
    }

    @Get("me")
    @MeAuthDocs()
    @UseGuards(AuthGuard)
    async me(@Req() req: Request): Promise<UserDto> {
        const sessionToken = req.cookies?.session as string;

        const user = await this.authService.me(sessionToken);

        return user;
    }
}
