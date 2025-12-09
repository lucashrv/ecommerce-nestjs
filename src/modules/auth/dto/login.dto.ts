import { Type } from "class-transformer";
import {
    IsDefined,
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsString,
    ValidateNested,
} from "class-validator";
import { UserDto } from "src/modules/user/dto/data-user.dto";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;
}
