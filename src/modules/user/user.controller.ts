import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { DataUserDto, UserDto } from "./dto/data-user.dto";
import {
    CreateUserDocs,
    FindAllUserDocs,
    FindOneUserDocs,
} from "../../swagger/user.swagger";
import { AuthGuard } from "../auth/guards/auth.guard";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @CreateUserDocs()
    async create(@Body() body: CreateUserDto): Promise<DataUserDto> {
        return await this.userService.create(body);
    }

    @Get()
    @UseGuards(AuthGuard)
    @FindAllUserDocs()
    async findAll(): Promise<UserDto[]> {
        return await this.userService.findAll();
    }

    @Get("/:id")
    @UseGuards(AuthGuard)
    @FindOneUserDocs()
    async findOne(@Param("id") id: string): Promise<UserDto> {
        return await this.userService.findOne(id);
    }
}
