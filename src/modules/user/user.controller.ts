import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { DataUserDto, UserDto } from "./dto/data-user.dto";
import {
    CreateUserDocs,
    FindAllUserDocs,
    FindOneUserDocs,
} from "../../swagger/user.swagger";
import { AuthGuard } from "../auth/auth.guard";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @CreateUserDocs()
    create(@Body() body: CreateUserDto): Promise<DataUserDto> {
        return this.userService.create(body);
    }

    @Get()
    @UseGuards(AuthGuard)
    @FindAllUserDocs()
    findAll(): Promise<UserDto[]> {
        return this.userService.findAll();
    }

    @Get("/:id")
    @UseGuards(AuthGuard)
    @FindOneUserDocs()
    findOne(@Param("id") id: string): Promise<UserDto> {
        return this.userService.findOne(id);
    }
}
