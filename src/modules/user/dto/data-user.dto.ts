import {
    IsBoolean,
    IsDefined,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from "class-validator";
import { Role } from "@prisma/client";
import { Type } from "class-transformer";

export class UserDto {
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

export class DataUserDto {
    @IsString()
    message: string;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => UserDto)
    data: UserDto;
}
