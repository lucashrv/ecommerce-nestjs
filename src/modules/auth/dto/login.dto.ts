import { Type } from "class-transformer";
import {
    IsDefined,
    IsNotEmptyObject,
    IsObject,
    ValidateNested,
} from "class-validator";
import { DataUserDto } from "src/modules/user/dto/data-user.dto";

export class LoginDto {
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => DataUserDto)
    user: DataUserDto;
}
