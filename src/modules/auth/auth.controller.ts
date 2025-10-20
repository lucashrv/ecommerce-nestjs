import { Controller, Get } from "@nestjs/common";

@Controller("/api")
export class AuthController {
    @Get("/auth")
    getUsers(): object {
        return {};
    }
}
