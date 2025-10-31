import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("api")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("user")
    create(@Body() body: CreateUserDto) {
        return this.userService.create(body);
    }

    @Get("users")
    findAll() {
        return this.userService.findAll();
    }

    @Get("user/:id")
    findOne(@Param("id") id: string) {
        return this.userService.findOne(+id);
    }

    @Patch("user/:id")
    update(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(+id, body);
    }

    @Delete("user/:id")
    remove(@Param("id") id: string) {
        return this.userService.remove(+id);
    }
}
