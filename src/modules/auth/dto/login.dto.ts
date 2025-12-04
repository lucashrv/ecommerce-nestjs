import { Type } from "class-transformer";
import {
    IsDefined,
    IsNotEmptyObject,
    IsObject,
    ValidateNested,
} from "class-validator";
import { UserDto } from "src/modules/user/dto/data-user.dto";

export class LoginDto {
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;
}
