import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from "class-validator";
import { Role } from "@prisma/client";

export class DataUserDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @IsString()
    @IsOptional()
    image?: string | null;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
