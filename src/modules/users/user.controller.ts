import { Controller, Get } from "@nestjs/common";

@Controller("/api")
export class UserController {
    @Get("/users")
    getUsers() {
        return {};
    }
}
