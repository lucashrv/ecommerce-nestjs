import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { DatabaseModule } from "./database/database.module";

@Module({
    imports: [DatabaseModule, UserModule, AuthModule],
})
export class AppModule {}
