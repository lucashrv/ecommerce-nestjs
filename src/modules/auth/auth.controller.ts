import {
    Controller,
    Post,
    Body,
    Res,
    Req,
    Get,
    HttpCode,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { credentialsDto } from "./dto/credentials.dto";
import { DataUserDto } from "../user/dto/data-user.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @HttpCode(200)
    async login(
        @Body() body: credentialsDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<DataUserDto> {
        const { sessionToken, expires, user } =
            await this.authService.login(body);

        const secure = process.env.NODE_ENV === "production";

        res.cookie("session", sessionToken, {
            httpOnly: true,
            secure,
            sameSite: "lax",
            path: "/",
            expires,
        });

        return user;
    }

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

        return { message: "Usuário efetuou logout" };
    }

    @Get("me")
    async me(@Req() req: Request): Promise<DataUserDto> {
        const sessionToken = req.cookies?.session as string;

        const user = await this.authService.me(sessionToken);

        return user;
    }
}
