import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";
import { Role } from "@prisma/client";

export class CreateUserDto {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(255)
    password: string;

    @IsString()
    @MaxLength(255)
    confirmPassword: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @IsString()
    @IsOptional()
    image?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
