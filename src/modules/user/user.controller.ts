import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { DataUserDto } from "./dto/data-user.dto";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() body: CreateUserDto): Promise<DataUserDto> {
        return this.userService.create(body);
    }

    @Get()
    findAll(): Promise<DataUserDto[]> {
        return this.userService.findAll();
    }

    @Get("/:id")
    findOne(@Param("id") id: string): Promise<DataUserDto> {
        return this.userService.findOne(id);
    }
}
