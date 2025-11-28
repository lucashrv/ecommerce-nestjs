import { Type } from "class-transformer";
import {
    IsDate,
    IsDefined,
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsString,
    ValidateNested,
} from "class-validator";
import { DataUserDto } from "src/modules/user/dto/data-user.dto";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    sessionToken: string;

    @IsDate()
    @IsNotEmpty()
    expires: Date;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => DataUserDto)
    user: DataUserDto;
}
