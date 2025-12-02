import {
    Controller,
    Post,
    Body,
    Res,
    Req,
    Get,
    HttpCode,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { credentialsDto } from "./dto/credentials.dto";
import { DataUserDto } from "../user/dto/data-user.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @HttpCode(200)
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
    async logoutAll(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{
        message: string;
    }> {
        const userId = req.user?.id as string;

        await this.authService.logoutAll(userId);

        res.clearCookie("session", { path: "/" });

        return { message: "Sessão encerrada" };
    }

    @Get("me")
    @UseGuards(AuthGuard)
    async me(@Req() req: Request): Promise<DataUserDto> {
        const sessionToken = req.cookies?.session as string;

        const user = await this.authService.me(sessionToken);

        return user;
    }
}
